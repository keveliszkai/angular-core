import { Directive, Input, ViewContainerRef, TemplateRef, Renderer2 } from '@angular/core';
import { PermissionService } from '../services/permission.service';
/**
 * This directive determines, if the current user can edit the selected input (will be disabled, if not). Input must be the permission name.
 *
 * @example <input *canEdit="'user-update'" type="text" [(ngModel)]="model.email" class="form-control" name="email" required>
 * @export
 * @class CanEditDirective
 */
@Directive({
  selector: '[canEdit]'
})
export class CanEditDirective {
  @Input()
  set canEdit(permission: string) {
    this._negative = permission.charAt(0) === '!';
    this._permission = this._negative ? permission.substr(1) : permission;

    if (this._negative) {
      this.service.canActivate(this._permission) ? this.renderDisabled() : this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.service.canActivate(this._permission) ? this.viewContainer.createEmbeddedView(this.templateRef) : this.renderDisabled();
    }
  }

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly service: PermissionService,
    private readonly renderer: Renderer2
  ) {
    this.service.permissionsChanged.subscribe(() => {
      if (this._negative) {
        this.service.canActivate(this._permission) ? this.renderDisabled() : this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.service.canActivate(this._permission) ? this.viewContainer.createEmbeddedView(this.templateRef) : this.renderDisabled();
      }
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

  /**
   * Rendering the disabled element.
   *
   * @private
   * @memberof CanEditDirective
   */
  private renderDisabled() {
    const view = this.viewContainer.createEmbeddedView(this.templateRef);
    const rootElem = view.rootNodes[0];
    if (rootElem) {
      this.renderer.setProperty(rootElem, 'disabled', true);
    }
  }
}
