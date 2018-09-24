import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { EnvironmentService } from '../../services/environment.service';
import { ErrorService } from './error.sevice';
import { ObjectUtils } from '../models/object-utils.model';

@Injectable()
export class BlobService {
  constructor(environmentService: EnvironmentService, private readonly http: HttpClient, private readonly errorService: ErrorService) {
    this.apiUrl = environmentService.environment.apiUrl;
  }

  /**
   * Stored apiUrl, that comes from the parent module.
   */
  private readonly apiUrl: string;

  /**
   * GET request, that expects blob response. It will download it, if the response has 'content-disposition' header.
   * Otherwise it will throw an error notification.
   * @param path The relative path to the backend endpoint. For example
   * @param params The query params, that goes with the request.
   * @example getBlob('/api/some/route', { id: 5 });
   */
  public getBlob(path: string, params: object = {}): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}${path}`, {
        params: ObjectUtils.objectToParams(params),
        responseType: 'blob',
        observe: 'response'
      })
      .catch((error, caught: Observable<HttpResponse<Blob>>) => this.errorService.errorHandling<HttpResponse<Blob>>(error, caught))
      .map((resp: HttpResponse<Blob>) => this.handleBlobResponse(resp));
  }

  /**
   * POST request, that expects blob response. It will download it, if the response has 'content-disposition' header.
   * Otherwise it will throw an error notification.
   * @param path The relative path to the backend endpoint. For example
   * @param params The query params, that goes with the request.
   * @example getBlob('/api/some/route', { id: 5 });
   */
  public postForBlob(path: string, params: object = {}): Observable<Blob> {
    return this.http
      .post(`${this.apiUrl}${path}`, params, {
        params: ObjectUtils.objectToParams(params),
        responseType: 'blob',
        observe: 'response'
      })
      .catch((error, caught: Observable<HttpResponse<Blob>>) => this.errorService.errorHandling<HttpResponse<Blob>>(error, caught))
      .map((resp: HttpResponse<Blob>) => this.handleBlobResponse(resp));
  }

  /**
   * This function handles the response, if the request was successfully.
   * @param resp Response, that came from the api request.
   */
  private handleBlobResponse(resp: HttpResponse<Blob>): Blob {
    const headers = resp.headers.keys();
    let blob = new Blob();

    if (headers.find(i => i === 'content-disposition')) {
      // Good file
      const content = resp.headers.get('content-disposition');
      const start = content.indexOf('"');
      const end = content.indexOf('"', start + 1);
      const fileName = content.slice(start, end);

      blob = new Blob([resp.body], { type: resp.headers.get('content-type') });

      this.downloadBlob(blob, fileName ? fileName : null);
    } else {
      // Has error
      this.errorService.commonoError();
    }

    return blob;
  }

  /**
   * This function downloads the getBlob and postForBlob functions' files.
   * @param blob The Blob instance.
   * @param filename Optional parameter. It overrides the 'content-disposition' header filename.
   */
  private downloadBlob(blob: Blob, filename?: string) {
    if (blob) {
      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
        return;
      }

      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.style.display = 'none';
      a.download = filename ? filename : 'export';
      document.body.appendChild(a);

      a.click();

      const time = 100;

      setTimeout(function() {
        // For Firefox it is necessary to delay revoking the ObjectURL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, time);
    }
  }
}
