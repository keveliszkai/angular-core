import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateComponent } from '../create/create.component';

@Injectable()
export abstract class /**
 * This is the abstract create component that can be used with Reactive forms in the create views.
 * This class is highly recommended to use with Reactive Forms.
 */
ReactiveCreateComponent<T> extends CreateComponent<T> implements OnInit {
  /**
   * The formGroup, that is displayed.
   */
  public form: FormGroup;

  constructor() {
    super();
  }

  /**
   * Public property that can be used as change detection.
   * @returns true if there are no changes.
   */
  public get disabled(): boolean {
    return this.form.invalid || this.loading;
  }

  /**
   * This method extends the CreateComponent's onChildInit method with the filling of the form part.
   */
  public ngOnInit() {
    this.model = this.initModel();
    this.form = this.getForm();
    super.ngOnInit();
  }

  /**
   * This function sets the CreateComponent's model before creating.
   */
  public beforeCreate() {
    this.loadModelFromForm();
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will returns the FormGroup from the T model.
   * @returns FormGroup
   * @example
   * public getForm(): FormGroup {
   *    return this.model.getFormGroup();
   * }
   */
  protected abstract getForm(): FormGroup;

  /**
   * The abstract function, that needs to be implemented in the child element. This method will transform the FormGroup into the model.
   * @returns void
   * @example
   * public loadModelFromForm(): void {
   *    this.model.loadFromFormGroup(this.form);
   * }
   */
  protected abstract loadModelFromForm(): void;
}
