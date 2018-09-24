import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EditComponent } from '../edit/edit.component';

@Injectable()
export abstract class /**
 * This is the abstract edit component that can be used with Reactive forms in the edit views.
 * This class is highly recommended to use with Reactive Forms.
 */
ReactiveEditComponent<T> extends EditComponent<T> {
  /**
   * The formGroup, that is displayed.
   */
  public form: FormGroup;

  /**
   * Original value of the initial form.
   */
  protected originalFormContent: object;

  constructor() {
    super(null);
  }

  /**
   * Public property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  public get disabled(): boolean {
    return this.form.invalid || this.loading || this.noChange;
  }

  /**
   * This method extends the EditComponent's setModel method with the filling of the editForm part.
   */
  public beforeModelLoaded() {
    this.form = this.getForm();
    this.originalFormContent = this.form.getRawValue();
  }

  /**
   * This function sets the EditComponent's model before uploading.
   */
  public beforeUpdate() {
    this.loadModelFromForm();
  }

  /**
   * Private property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  protected get noChange(): boolean {
    return JSON.stringify(this.form.getRawValue()) === JSON.stringify(this.originalFormContent);
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will returns the FormGroup from the T model.
   * @returns {FormGroup}
   * public getForm(): FormGroup {
   *    return this.model.getFormGroup();
   * }
   */
  protected abstract getForm(): FormGroup;

  /**
   * The abstract function, that needs to be implemented in the child element. This method will transform the FormGroup into the model.
   * @returns {void}
   * public loadModelFromForm(): void {
   *    this.model.loadFromFormGroup(this.form);
   * }
   */
  protected abstract loadModelFromForm(): void;
}
