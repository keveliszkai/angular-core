import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../services/environment.service';

@Injectable()
export class CustomTranslateLoader implements TranslateLoader {
  constructor(environmentService: EnvironmentService, private readonly http: HttpClient) {
    this.contentHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environmentService.environment.apiUrl
    });

    this.apiUrl = environmentService.environment.apiUrl;
  }

  private readonly contentHeader: HttpHeaders;

  /**
   * Stored apiUrl, that comes from the parent module.
   */
  private readonly apiUrl: string;

  // TranslateLoader function
  public getTranslation(lang: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/translation`, {
      headers: this.contentHeader,
      params: { locale: lang }
    });
  }
}
