import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../base/base.component';

/**
 * Recommended class for the form components.
 */
export abstract class FormComponent extends BaseComponent {
  /**
   * The FormGroup, that represents the form.
   */
  @Input() public group: FormGroup;

  /**
   * This variable show, if it is a create form.
   */
  @Input() public create = false;

  /**
   * This variable show, if it is a create form.
   */
  public get isCreateForm(): boolean {
    return this.create;
  }

  /**
   * This variable show, if it is an Edit form.
   */
  public get isEditForm(): boolean {
    return !this.create;
  }
}
