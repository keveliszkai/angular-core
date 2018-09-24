import { Injectable, EventEmitter } from '@angular/core';
import { Cookie } from 'ng2-cookies';

import { TokenResponse } from '../../api/interfaces/token.response';

@Injectable()
export class OauthService {
  /**
   * This event fires, when the Expires In variable nearly expired.
   */
  public nearlyExpired: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    if (this.hasToken()) {
      this.startExpirationTimer();
    }
  }

  /**
   * Token expiration timer id
   */
  private expirationTimer: any;

  /**
   * Name of the cookie, that stores the Access Token.
   */
  private readonly accessTokenCookieName = 'access_token';

  /**
   * Name of the cookie, that stores the Refresh Token.
   */
  private readonly refreshTokenCookieName = 'refresh_token';

  /**
   * Name of the cookie, that stores the Expires In variable.
   */
  private readonly expirationAtCookieName = 'token_expires_at';

  /**
   * Plus time added to the expires_in property.
   *
   * @private
   * @memberof OauthService
   */
  private readonly expiresInAddon = 1000;

  /**
   * Amount of time, when the token nearly expired (in ms).
   *
   * @private
   * @memberof OauthService
   */
  private readonly nearlyExpiredMs = 30000;

  /**
   * This function returns the stored Access Token.
   */
  public getToken(): string {
    return Cookie.get(this.accessTokenCookieName);
  }

  /**
   * This function stores the given token to the CookieStore.
   * @param token The token that came from the API.
   */
  public setToken(token: TokenResponse): void {
    const expireDate = new Date(Date.now() + this.expiresInAddon * +token.expires_in);
    Cookie.set(this.accessTokenCookieName, token.access_token, expireDate);
    Cookie.set(this.refreshTokenCookieName, token.refresh_token, expireDate);
    Cookie.set(this.expirationAtCookieName, expireDate.getTime().toString(), expireDate);
    this.startExpirationTimer();
  }

  /**
   * This function returns `true` if there is any Access Token in the browser's CookieStore.
   */
  public hasToken(): boolean {
    return Cookie.check(this.accessTokenCookieName);
  }

  /**
   * This function removes the Access Token from the browser's CookieStore.
   */
  public deleteToken(): void {
    Cookie.delete(this.accessTokenCookieName);
    this.stopExpirationTimer();
  }

  /**
   * This function (re)starts the token expiration timer
   */
  private startExpirationTimer(): void {
    this.stopExpirationTimer();

    const expiresIn = +Cookie.get(this.expirationAtCookieName) - Date.now();
    if (expiresIn < this.nearlyExpiredMs) {
      this.nearlyExpired.emit(Cookie.get(this.refreshTokenCookieName));
    } else {
      this.expirationTimer = setTimeout(() => {
        this.nearlyExpired.emit(Cookie.get(this.refreshTokenCookieName));
      }, expiresIn - this.nearlyExpiredMs);
    }
  }

  /**
   * This function stops the token expiration timer
   */
  private stopExpirationTimer(): void {
    clearTimeout(this.expirationTimer);
  }
}
