import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { Notification } from '../models/notification.model';
import { IconClasses } from '../models/icon-classes.enum';
import { NotificationResponse } from '../interfaces/notification-response.interface';
import { NotificationType } from '../models/notification-type.enum';
import { _ } from '../../language/marker';

@Injectable()
export class NotificationService {
  constructor(private readonly toastr: ToastrService) {}

  /**
   * Additional timeout if there's an error.
   *
   * @private
   * @memberof NotificationService
   */
  private readonly extendedTimeout = 15000;

  /**
   * Configuration for the error messages.
   *
   * @private
   * @type {Partial<IndividualConfig>}
   * @memberof NotificationService
   */
  private readonly errorConfig: Partial<IndividualConfig> = {
    timeOut: this.extendedTimeout
  };

  /**
   * Handles all response. If there's no type, Info is the default.
   *
   * @param {NotificationResponse[]} notifications
   * @returns {void}
   * @memberof NotificationService
   */
  public handleResponse(notifications: NotificationResponse[]): void {
    if (!notifications) {
      return;
    }

    notifications.map(notificationResponse => new Notification(notificationResponse)).forEach(notification => this.notify(notification));
  }

  /**
   * Handles only the successfull notifications
   *
   * @param {NotificationResponse[]} notifications
   * @returns {void}
   * @memberof NotificationService
   */
  public handleSuccess(notifications: NotificationResponse[]): void {
    if (!notifications) {
      return;
    }

    notifications.filter(i => i.status === NotificationType.success).forEach(element => {
      this.toastr.success(element.message, element.title);
    });
  }

  /**
   * Basic notify. Error/Info/Success.
   *
   * @param {Notification} notification
   * @memberof NotificationService
   */
  public notify(notification: Notification) {
    if (notification.getToastType() === IconClasses.error) {
      this.toastr.error(notification.message, notification.title, this.errorConfig);
    } else {
      this.toastr.show(notification.message, notification.title, null, notification.getToastType());
    }
  }

  /**
   * Notify error
   *
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  public error(title: string, message: string) {
    this.toastr.error(message, title, this.errorConfig);
  }

  /**
   * Clears all natifications
   *
   * @memberof NotificationService
   */
  public clearAll() {
    this.toastr.clear();
  }

  /**
   * Notify with success
   *
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  public success(title: string, message: string) {
    this.toastr.success(title, message);
  }
}
