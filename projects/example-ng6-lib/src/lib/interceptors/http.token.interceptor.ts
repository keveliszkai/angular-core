import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OauthService } from '../api';
import { EnvironmentService } from '../services';
import { LanguageService } from '../language';

/**
 * This interceptor adds the headers to all request.
 *
 * @export
 * @class HttpTokenInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly oauthService: OauthService,
    readonly environmentService: EnvironmentService,
    private readonly languageService: LanguageService
  ) {
    this.apiUrl = environmentService.environment.apiUrl;
  }

  private readonly apiUrl: string;
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': this.apiUrl,
      Accept: 'application/json'
    };

    headersConfig['Accept-Language'] = this.languageService.currentLang;

    if (this.oauthService.hasToken()) {
      headersConfig['Authorization'] = `Bearer ${this.oauthService.getToken()}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
