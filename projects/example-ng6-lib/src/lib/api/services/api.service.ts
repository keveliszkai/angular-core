import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ListResponse } from '../interfaces/list-response.interface';
import { DetailResponse } from '../interfaces/detail-response.interface';
import { BaseResponse } from '../interfaces/base-response.interface';
import { ListObject } from '../../models/list-object.model';
import { EnvironmentService } from '../../services/environment.service';
import { ErrorService } from './error.sevice';
import { ObjectUtils } from '../models/object-utils.model';
import { BlobService } from './blob.service';
import { NotificationService } from '../../notification';

@Injectable()
export class ApiService {
  constructor(
    environmentService: EnvironmentService,
    private readonly http: HttpClient,
    private readonly blobService: BlobService,
    private readonly errorService: ErrorService,
    private readonly notificationService: NotificationService
  ) {
    this.errorService.setTranslations();
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
    return this.blobService.getBlob(path, params);
  }

  /**
   * POST request, that expects blob response. It will download it, if the response has 'content-disposition' header.
   * Otherwise it will throw an error notification.
   * @param path The relative path to the backend endpoint. For example
   * @param params The query params, that goes with the request.
   * @example getBlob('/api/some/route', { id: 5 });
   */
  public postForBlob(path: string, params: object = {}): Observable<Blob> {
    return this.blobService.postForBlob(path, params);
  }

  /**
   * raw GET request, that expects T response.
   * @param path The relative path to the backend endpoint.
   * @param params The query params, that goes with the request.
   * @example get<MyObject>('/api/some/route', { id: 5 });
   */
  public getRaw<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}${path}`, {
        params: params
      })
      .pipe(catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught)));
  }

  /**
   * GET request, that expects ListObject<T> response. It is the response, that came from the backend response transformer.
   * This response can be used by the core's ListComponent<T>. This function handles the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param params The query params, that goes with the request.
   * @example getList<MyObject>('/api/some/route', { search: 'some string' });
   */
  public getList<T>(path: string, params: object = {}): Observable<ListObject<T>> {
    return this.http
      .get<ListResponse<T>>(`${this.apiUrl}${path}`, {
        params: ObjectUtils.objectToParams(params)
      })
      .pipe(
        map(response => {
          this.handleResponse(response);
          return new ListObject<T>(response.data, response.meta && response.meta.pagination ? response.meta.pagination.total : 0);
        })
      );
  }

  /**
   * GET request, that expects T response. It is the response, that came from the backend response transformer. This function handles
   * the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param params The query params, that goes with the request.
   * @example getOne<MyObject>('/api/some/route', { someValue: 'some string' });
   */
  public getOne<T>(path: string, params: object = {}): Observable<T> {
    return this.http
      .get<DetailResponse<T>>(`${this.apiUrl}${path}`, {
        params: ObjectUtils.objectToParams(params)
      })
      .pipe(
        map(response => {
          this.handleResponse(response);
          return response.data;
        }),
        catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught))
      );
  }

  /**
   * PUT request, the most common update method. This can be used as the update method of the core's EditComponent<T>.
   * This function handles the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param body The object, that is the information for the backend.
   * @example put<MyObject>('/api/some/route', { newName: 'some string' }, true);
   */
  public put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.put<DetailResponse<T>>(`${this.apiUrl}${path}`, body).pipe(
      map(response => {
        this.handleResponse(response);
        return response ? response.data : null;
      }),
      catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught))
    );
  }

  /**
   * POST request, the most common create method. This can be used as the create method of the core's CreateComponent<T>.
   * This function handles the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param body The object, that is the information for the backend.
   * @example post<MyObject>('/api/some/route', { newName: 'some string' });
   */
  public post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<DetailResponse<T>>(`${this.apiUrl}${path}`, body).pipe(
      map(response => {
        this.handleResponse(response);
        return response ? response.data : null;
      }),
      catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught))
    );
  }

  /**
   * DELETE request, the most common destroy method. This function handles the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param body The object, that is the information for the backend.
   * @example delete<MyResponseObject>('/api/some/route', { idToDelete: 2 });
   */
  public delete<T>(path: string, body: Object = {}): Observable<T | T[]> {
    return this.http
      .delete<BaseResponse<T>>(`${this.apiUrl}${path}`, {
        params: ObjectUtils.objectToParams(body)
      })
      .pipe(
        map(response => {
          this.handleResponse(response);
          return response ? response.data : null;
        }),
        catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught))
      );
  }

  /**
   * This function can be used by 3rd party plugins, to handle the core's response transformer. This function handles the notifications,
   * metas, etc...
   * @param response BaseResponse that came from the backend response transformer. Notifications, metas, etc...
   */
  public handleResponse<T>(response: BaseResponse<T>) {
    if (response && response.meta) {
      this.notificationService.handleResponse(response.meta.notifications);
    }
  }

  /**
   * [DEPRECATED] PUT request, the most common update method. This can be used as the update method of the core's EditComponent<T>.
   * This function handles the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param form The FormData, that is the information for the backend.
   * @example put<MyObject>('/api/some/route', { newName: 'some string' }, true);
   */
  public putForm<T>(path: string, form: FormData): Observable<T> {
    // Symphony/Laravel fix
    form.append('_method', 'put');

    return this.http.post<DetailResponse<T>>(`${this.apiUrl}${path}`, form).pipe(
      map(response => {
        this.handleResponse(response);
        return response ? response.data : null;
      }),
      catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught))
    );
  }

  // ---------------------------------[DEPRECATED]------------------------------

  /**
   * [DEPRECATED] POST request, the most common create method. This can be used as the create method of the core's CreateComponent<T>.
   * This function handles the BaseResponse's notifications and meta properties.
   * @param path The relative path to the backend endpoint.
   * @param form The FormData, that is the information for the backend.
   * @example post<MyObject>('/api/some/route', { newName: 'some string' }, true);
   * @deprecated
   */
  public postForm<T>(path: string, form: FormData): Observable<T> {
    return this.http.post<DetailResponse<T>>(`${this.apiUrl}${path}`, form).pipe(
      map(response => {
        this.handleResponse(response);
        return response ? response.data : null;
      }),
      catchError((error, caught: Observable<T>) => this.errorService.errorHandling<T>(error, caught))
    );
  }
}
