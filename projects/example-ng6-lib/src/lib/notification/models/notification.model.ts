import { NotificationType } from './notification-type.enum';
import { IconClasses } from './icon-classes.enum';
import { NotificationResponse } from '../../notification/interfaces/notification-response.interface';

export class Notification {
  public title: string;
  public message: string;
  public type: NotificationType;

  constructor(response?: NotificationResponse) {
    this.title = (response && response.title) || undefined;
    this.message = (response && response.message) || undefined;
    this.type = (response && +response.status) || NotificationType.info;
  }

  public getToastType(): IconClasses {
    switch (this.type) {
      case NotificationType.error:
        return IconClasses.error;
      case NotificationType.success:
        return IconClasses.success;
      case NotificationType.warning:
        return IconClasses.warning;
      case NotificationType.info:
      default:
        return IconClasses.info;
    }
  }
}
