import { FormGroup } from '@angular/forms';
import { TranslatableForm } from '../components';

export interface FactoryBase<T> {
  /**
   * Must have function for the factory.
   *
   * @param {*} response
   * @returns {(T | T[])}
   * @memberof FactoryBase
   */
  loadFromResponse(response: any): T | T[];

  /**
   * [OPTIONAL] If the model must be updated, this request can be used for update or create.
   *
   * @param {T} model
   * @returns {*}
   * @memberof FactoryBase
   */
  toRequest?(model: T): any;

  /**
   * [OPTIONAL] This function implements the getter of the reactive form.
   *
   * @param {T} model
   * @param {string} locale
   * @returns {FormGroup}
   * @memberof FactoryBase
   */
  getFormGroup?(model: T): FormGroup;

  /**
   * [OPTIONAL] This function implements the getter of the translatable form.
   *
   * @param {T} model
   * @param {string} locale
   * @returns {FormGroup}
   * @memberof FactoryBase
   */
  getTranslatableForm?(model: T, locale: string): FormGroup;

  /**
   * [OPTIONAL] This function loads the model from the translatable forms.
   *
   * @param {T} model
   * @param {TranslatableForm[]} forms
   * @returns {T}
   * @memberof FactoryBase
   */
  setTranslations?(model: T, forms: TranslatableForm[]): T;
}
