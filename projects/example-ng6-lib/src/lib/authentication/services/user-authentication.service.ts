import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { map, tap, catchError, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { of, BehaviorSubject, ReplaySubject, Observable } from 'rxjs';

import { ApiService, OauthService } from '../../api';
import { AuthenticationUser } from '../models/authentication-user.model';
import { AuthenticationUserResponse } from '../interfaces/authentication-user.response';
import { Environment } from '../../interfaces';
import { EnvironmentService } from '../../services/environment.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenResponse } from '../../api/interfaces/token.response';

/**
 * This service handles the authentication methods.
 *
 * @export
 * @class UserAuthenticationService
 */
@Injectable()
export class UserAuthenticationService {
  /**
   * The current, loged in user.
   *
   * @type {(AuthenticationUser | null)}
   * @memberof UserAuthenticationService
   */
  public currentUser: Observable<AuthenticationUser>;

  /**
   * Defines if the client is authenticated.
   *
   * @type {Observable<boolean>}
   * @memberof UserAuthenticationService
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * Internal user subject.
   *
   * @private
   * @memberof UserAuthenticationService
   */
  public readonly currentUserSubject = new BehaviorSubject<AuthenticationUser>(undefined);

  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly oauthService: OauthService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.environment = this.environmentService.environment;

    this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
    this.currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    this.oauthService.nearlyExpired.subscribe(token => {
      this.refreshAccessToken(token).subscribe(null, err => console.error(err));
    });
  }

  /**
   * Internal authentication flag.
   *
   * @private
   * @memberof UserAuthenticationService
   */
  private readonly isAuthenticatedSubject = new ReplaySubject<boolean>(1);

  /**
   * Environment from the CoreModule.
   *
   * @private
   * @type {Environment}
   * @memberof UserAuthenticationService
   */
  private readonly environment: Environment;

  /**
   * Headers.
   *
   * @private
   * @memberof UserAuthenticationService
   */
  private readonly header = {
    'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    Authorization: 'Basic ' + btoa('fooClientIdPassword:secret')
  };

  /**
   * This function registrate one user to the API.
   *
   * @param {{
   *     firstName: string;
   *     lastName: string;
   *     email: string;
   *     password: string;
   *     passwordConfirmation: string;
   *   }} user
   * @returns {Observable<boolean>}
   * @memberof UserAuthenticationService
   */
  public registrateUser(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Observable<boolean> {
    const params = new HttpParams();
    params.append('first_name', user.firstName);
    params.append('last_name', user.lastName);
    params.append('email', user.email);
    params.append('password', user.password);
    params.append('password_confirmation', user.passwordConfirmation);

    return this.http
      .post(`${this.environment.apiUrl}/${this.environment.apiUrlPath}/register`, params.toString(), {
        headers: this.header
      })
      .pipe(
        map(res => this.oauthService.setToken(res as TokenResponse)),
        mergeMap(() => this.checkAuth())
      );
  }

  /**
   * This runs once on application startup.
   *
   * @param {boolean} [navigation=true] Defines, if you would like to navigate to login.
   * @returns {Observable<boolean>}
   * @memberof UserAuthenticationService
   */
  public checkAuth(navigation = true): Observable<boolean> {
    if (this.oauthService.hasToken()) {
      return this.apiService.getOne<AuthenticationUserResponse>('/me').pipe(
        tap(res => {
          this.setAuth(new AuthenticationUser(res));
        }),
        catchError(err => {
          console.error(err);
          this.purgeAuth(navigation);
          throw err;
        }),
        map(() => true)
      );
    } else {
      this.purgeAuth(navigation);
      return of(false);
    }
  }

  /**
   * This function gains the Tokens from the api.
   *
   * @param {{ username: string; password: string }} loginData
   * @returns {Observable<boolean>}
   * @memberof UserAuthenticationService
   */
  public obtainAccessToken(loginData: { username: string; password: string }): Observable<boolean> {
    const params = new HttpParams();
    params.append('username', loginData.username);
    params.append('password', loginData.password);
    params.append('grant_type', 'password');
    params.append('client_id', this.environment.clientId);
    params.append('client_secret', this.environment.clientSecret);

    return this.http.post(this.environment.apiUrl + '/oauth/token', params.toString(), { headers: this.header }).pipe(
      map(res => this.oauthService.setToken(res as TokenResponse)),
      mergeMap(() => this.checkAuth())
    );
  }

  /**
   * This function does the logout. Removes the tokens, and removes the user.
   *
   * @param {boolean} [navigation=true]
   * @memberof UserAuthenticationService
   */
  public purgeAuth(navigation = true) {
    this.currentUserSubject.next(undefined);
    this.isAuthenticatedSubject.next(false);

    this.oauthService.deleteToken();

    if (navigation) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * This function resets the Access token.
   *
   * @private
   * @param {string} token
   * @returns {Observable<boolean>}
   * @memberof UserAuthenticationService
   */
  private refreshAccessToken(token: string): Observable<boolean> {
    const params = new HttpParams();
    params.append('refresh_token', token);
    params.append('grant_type', 'refresh_token');
    params.append('client_id', this.environment.clientId);
    params.append('client_secret', this.environment.clientSecret);

    return this.http.post(this.environment.apiUrl + '/oauth/token', params.toString(), { headers: this.header }).pipe(
      map(res => this.oauthService.setToken(res as TokenResponse)),
      mergeMap(() => this.checkAuth())
    );
  }

  /**
   * This method stores the tokens, and fires the logged in events.
   *
   * @private
   * @param {AuthenticationUser} user
   * @memberof UserAuthenticationService
   */
  private setAuth(user: AuthenticationUser) {
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

    // Set current user data into observable
    this.currentUserSubject.next(user);
  }
}
