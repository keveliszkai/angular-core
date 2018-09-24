import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { PermissionService } from '../services/permission.service';
/**
 * This directive determines, if the current user can see (activate) the selected input (won't be there, if not).
 * Input must be the permission name.
 *
 * @example <input *canActivate="'user-update'" type="text" [(ngModel)]="model.email" class="form-control" name="email" required>
 * @export
 * @class CanActivateDirective
 */
@Directive({
  selector: '[canActivate]'
})
export class CanActivateDirective {
  @Input()
  set canActivate(permission: string) {
    if (permission) {
      this._negative = permission.charAt(0) === '!';
      this._permission = this._negative ? permission.substr(1) : permission;

      if (this._negative) {
        this.service.canActivate(this._permission) ? this.viewContainer.clear() : this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.service.canActivate(this._permission) ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();
      }
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly service: PermissionService
  ) {
    this.service.permissionsChanged.subscribe(() => {
      this.service.canActivate(this._permission) ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();
    });
  }

  /**
   * Name of the permission
   *
   * @private
   * @type {string}
   * @memberof CanEditDirective
   */
  private _permission: string;

  /**
   * Determines if the name is negated.
   *
   * @private
   * @type {boolean}
   * @memberof CanEditDirective
   */
  private _negative: boolean;
}
