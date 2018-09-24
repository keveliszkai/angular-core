import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EditComponent } from '../edit/edit.component';
import { KeyValues } from '../../key-value/models/key-values.model';

@Injectable()
/**
 * This is the abstract edit component that can be used with Reactive forms with Translations in the edit views.
 * This class is highly recommended to use with Reactive Forms.
 */
export abstract class TranslatableEditComponent<T> extends EditComponent<T> {
  /**
   * The formGroup, that is displayed. The man details (common) form.
   */
  public commonForm: FormGroup;

  /**
   * Original JSON value of the initial common form.
   */
  protected originalCommonFormContent: string;

  /**
   * The translatable forms. Indexed by locales.
   */
  public translatableForms: TranslatableForm[] = [];

  /**
   * Original JSON values of the initial translatable forms.
   */
  protected originalTranslatableFormContents: KeyValues = new KeyValues();

  constructor() {
    super(null);
  }

  /**
   * Public property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  public get disabled(): boolean {
    // TODO: Test Change detection in LIVE.
    return this.hasInvalidForm || !this.hasFilledTranslatableForm || /*this.noChange || this.noChangeTranslatable ||*/ this.loading;
  }

  /**
   * This method extends the EditComponent's setModel method with the filling of the editForm part.
   */
  public beforeModelLoaded() {
    this.getForms();
    this.originalCommonFormContent = JSON.stringify(this.commonForm.getRawValue());
    this.translatableForms.forEach(f => (this.originalTranslatableFormContents[f.locale] = JSON.stringify(f.form.getRawValue())));
  }

  /**
   * This function sets the EditComponent's model before uploading.
   */
  public beforeUpdate() {
    this.loadModelFromForms();
  }

  /**
   * Private property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  protected get noChange(): boolean {
    return JSON.stringify(this.commonForm.getRawValue()) === this.originalCommonFormContent;
  }

  /**
   * Private property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  protected get noChangeTranslatable(): boolean {
    return !!this.translatableForms.find(f => JSON.stringify(f.form.getRawValue()) !== this.originalTranslatableFormContents[f.locale]);
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
   * public getForms(): void {
   *    this.commonForm = this.model.getFormGroup();
   * }
   */
  protected abstract getForms(): void;

  /**
   * The abstract function, that needs to be implemented in the child element. This method will transform the FormGroup into the model.
   * @returns void
   * public loadModelFromForms(): void {
   *    this.model.loadFromFormGroup(this.form);
   * }
   */
  protected abstract loadModelFromForms(): void;
}

export interface TranslatableForm {
  locale: string;
  form: FormGroup;
}
