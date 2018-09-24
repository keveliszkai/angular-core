import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateComponent } from '../create/create.component';
import { TranslatableForm } from '../translatable-edit/translatable-edit.component';

@Injectable()
export abstract class /**
 * This is the abstract create component that can be used with Reactive forms with Translations in the create views.
 * This class is highly recommended to use with Reactive Forms.
 */
TranslatableCreateComponent<T> extends CreateComponent<T> {
  /**
   * The formGroup, that is displayed. The man details (common) form.
   */
  public commonForm: FormGroup;

  /**
   * The translatable forms. Indexed by locales.
   */
  public translatableForms: TranslatableForm[] = [];

  constructor() {
    super();
  }

  /**
   * Public property that can be used as change detection.
   * @returns true if there are no changes.
   */
  public get disabled(): boolean {
    return this.hasInvalidForm || !this.hasFilledTranslatableForm || this.loading;
  }

  /**
   * This method extends the CreateComponent's onChildInit method with the filling of the form part.
   */
  public onChildInit() {
    this.model = this.initModel();
    this.getForms();
  }

  /**
   * This function sets the CreateComponent's model before creating.
   */
  public beforeCreate() {
    this.loadModelFromForms();
  }

  /**
   * Private property that can be used as change detection.
   * @returns {boolean} true if there is an invalid form.
   */
  protected get hasInvalidForm(): boolean {
    return !!this.translatableForms.find(i => i.form.invalid) || this.commonForm.invalid;
  }

  /**
   * Private property that can be used as change detection.
   * @returns {boolean} true if there are at least one not empty and valid translatable form.
   */
  protected get hasFilledTranslatableForm(): boolean {
    return !!this.translatableForms.find(i => {
      return i.form.valid && !!Object.keys(i.form.value).find(key => !!i.form.value[key]);
    });
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will returns the FormGroup from the T model.
   * @returns void
   * @example
   * public getForm(): void {
   *    this.commonForm = this.model.getFormGroup();
   * }
   */
  protected abstract getForms(): void;

  /**
   * The abstract function, that needs to be implemented in the child element. This method will transform the FormGroup into the model.
   * @returns void
   * @example
   * public loadModelFromForm(): void {
   *    this.model.loadFromFormGroup(this.form);
   * }
   */
  protected abstract loadModelFromForms(): void;
}
