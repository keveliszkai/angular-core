import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NotificationService } from '../../notification';
import { EnvironmentService } from '../../services/environment.service';
import { HttpErrors } from '../interfaces/http-errors.enum';

@Injectable()
export class ErrorService {
  constructor(
    environmentService: EnvironmentService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService
  ) {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
    this.showNotifications = environmentService.environment.showNotifications;
  }

  /**
   * This variable defines, if the notification is needed.
   */
  private readonly showNotifications: boolean;

  /**
   * The title of the common error. It stores the translated value.
   */
  private commonErrorTitle: string;

  /**
   * The message of the common error. It stores the translated value.
   */
  private commonErrorMessage: string;

  /**
   * The messages of the errors. It stores the translated values.
   */
  private readonly errors = {
    e500: '',
    e404: '',
    e403: '',
    e401: '',
    noFile: ''
  };

  /**
   * This function also can be used by 3rd party plugins, to handle the core's response transformer's errors. Typical .catch() handler.
   * @param error The Response, that contains the errors.
   * @param caught The error object?
   */
  public errorHandling<T>(error: HttpErrorResponse, caught?: Observable<T>): Observable<T> {
    if (this.showNotifications) {
      if (error.error && error.error.errors) {
        for (const key in error.error.errors) {
          if (error.error.errors.hasOwnProperty(key)) {
            this.notificationService.error(key, error.error.errors[key][0]);
          }
        }
      } else {
        switch (error.status) {
          case HttpErrors.internalServerError:
            this.notificationService.error(error.status.toString(), this.errors.e500);
            break;
          case HttpErrors.notFound:
            this.notificationService.error(error.status.toString(), this.errors.e404);
            break;
          case HttpErrors.forbidden:
            this.notificationService.error(error.status.toString(), this.errors.e403);
            break;
          case HttpErrors.unauthorized:
            this.notificationService.error(error.status.toString(), this.errors.e401);
            break;
          default:
            console.error(error);
            console.error(caught);
            this.notificationService.error(this.commonErrorTitle, this.commonErrorMessage);
        }
      }
    }

    return new Observable<T>();
  }

  /**
   *  Sends a common error notification.
   *
   * @memberof ErrorService
   */
  public commonoError() {
    this.notificationService.error(this.commonErrorTitle, this.errors.noFile);
  }

  /**
   * This function populates the error messages and arrays with the translations.
   */
  public setTranslations() {
    this.translate
      .get([
        'errors.common.title',
        'errors.common.message',
        'errors.common.e404',
        'errors.common.e403',
        'errors.common.e401',
        'errors.common.e500',
        'errors.common.no-file'
      ])
      .subscribe(t => {
        this.commonErrorMessage = t['errors.common.message'];
        this.commonErrorTitle = t['errors.common.title'];
        this.errors.e500 = t['errors.common.e500'];
        this.errors.e404 = t['errors.common.e404'];
        this.errors.e403 = t['errors.common.e403'];
        this.errors.e401 = t['errors.common.e401'];
        this.errors.noFile = t['errors.common.no-file'];
      });
  }
}
