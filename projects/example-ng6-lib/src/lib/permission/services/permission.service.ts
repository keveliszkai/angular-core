import { Injectable, EventEmitter } from '@angular/core';
import { UserAuthenticationService } from '../../authentication/services/user-authentication.service';
/**
 * This service handles the user permissions.
 *
 * @export
 * @class PermissionService
 */
@Injectable()
export class PermissionService {
  /**
   * This event fires, when the permissions changed.
   *
   * @type {EventEmitter<boolean>}
   * @memberof PermissionService
   */
  public permissionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly userAuthenticationService: UserAuthenticationService) {
    this.userAuthenticationService.currentUser.subscribe(() => {
      this.permissionsChanged.emit(true);
    });
  }

  /**
   * Returns true if the user has the permission.
   *
   * @param {string} key
   * @returns {boolean}
   * @memberof PermissionService
   */
  public canActivate(key: string): boolean {
    return key && this.userAuthenticationService.currentUserSubject.value
      ? this.userAuthenticationService.currentUserSubject.value.permissions.find(i => i.name === key) !== undefined
      : false;
  }
}
