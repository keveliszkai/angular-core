import { FormGroup, Validators, FormControl } from '@angular/forms';

/**
 * Abstract model, that contains the following features: Load model from Reactive Form, Load FormGroup from Model.
 */
export abstract class ReactiveModel {
  /**
   * Keys, that must be excepted from the FormGroup.
   * @default []
   */
  protected excepts: string[] = ['id'];

  /**
   * Excepts from the abstract class.
   */
  private readonly alwaysExcepts = ['required', 'alwaysExcepts', 'excepts', 'allRequired'];

  /**
   * Determines if all of the given keys are required (validation).
   * @default true
   */
  protected allRequired = true;

  /**
   * Required keys. This keys will be populated with Validators.required.
   * @default []
   */
  protected required = [];

  /**
   * Returns the FormGroup object with Validatiors.
   * @param excepts You can manually add exceptions for different forms.
   * @default []
   * @returns FormGroupObject
   */
  public getFormGroup(excepts: string[] = []): FormGroup {
    const result: FormGroup = new FormGroup({});

    Object.keys(this).forEach(key => {
      if (
        typeof this[key] !== 'function' &&
        (!this.excepts.includes(key) && !this.alwaysExcepts.includes(key) && !excepts.includes(key)) &&
        (this.allRequired || this.required.includes(key))
      ) {
        result.addControl(key, new FormControl(this[key], { validators: Validators.required }));
      }
    });

    return result;
  }

  /**
   * Returns the CUSTOM FormGroup object with Validatiors.
   * @param keys Here, you can add the keys, with you want to work.
   * @param exceptKeys The determines, if the keys are except keys, or keeping keys.
   * @default false
   * @returns FormGroup
   */
  public buildForm(keys: string[], exceptKeys: boolean = false): FormGroup {
    const result: FormGroup = new FormGroup({});

    Object.keys(this).forEach(key => {
      if (
        typeof this[key] !== 'function' &&
        (exceptKeys ? !keys.includes(key) && !this.alwaysExcepts.includes(key) : keys.includes(key)) &&
        (this.allRequired || this.required.includes(key))
      ) {
        result.addControl(key, new FormControl(this[key], { validators: Validators.required }));
      }
    });

    return result;
  }

  /**
   * This function loads the data from the FormGroup into the model.
   * @param form The FormGroup, where the data is.
   * @param excepts The given keys will be excepted.
   * @default []
   * @returns FormGroup
   */
  public loadFromFormGroup(form: FormGroup, excepts: string[] = []): void {
    const temp: object = {};

    Object.keys(form.controls).forEach(key => {
      if (!excepts.includes(key)) {
        temp[key] = form.get(key).value;
      }
    });

    Object.assign(this, temp);
  }
}
