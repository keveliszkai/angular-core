import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { _ } from '../language/marker';

/**
 * Service, that contains the static validation functions.
 *
 * @export
 * @class ValidationService
 */
@Injectable()
export class ValidationService {
  private readonly messages = {
    required: _('controls.required'),
    invalidCreditCard: _('controls.invalidCreditCard'),
    invalidEmailAddress: _('controls.invalidEmailAddress'),
    invalidPassword: _('controls.invalidPassword'),
    minlength: _('controls.minlength')
  };

  /**
   * Gets the message of the validator error message.
   *
   * @param {string} validatorName
   * @param {*} [validatorValue]
   * @returns
   * @memberof ValidationService
   */
  public getValidatorErrorMessage(validatorName: string) {
    return this.messages[validatorName];
  }

  /**
   * Validator for the creadit cards. Visa, MasterCard, American Express, Diners Club, Discover, JCB.
   *
   * @static
   * @param {*} control
   * @returns
   * @memberof ValidationService
   */
  public static creditCardValidator(control) {
    if (!control.value) {
      return null;
    }

    if (
      control.value.match(
        // tslint:disable-next-line
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  /**
   * E-mail validator. RFC 2822 compliant regex.
   *
   * @static
   * @param {*} control
   * @returns
   * @memberof ValidationService
   */
  public static emailValidator(control) {
    if (!control.value) {
      return null;
    }

    if (
      control.value.match(
        // tslint:disable-next-line
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  /**
   * Password validator. Asserts password is between 6 and 100 characters and asserts a string has at least one number
   *
   * @static
   * @param {*} control
   * @returns
   * @memberof ValidationService
   */
  public static passwordValidator(control) {
    if (!control.value) {
      return null;
    }

    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  /**
   *  Validator for the translatable forms.
   *
   * @static
   * @param {FormGroup} group
   * @returns {(ValidationErrors | null)}
   * @memberof ValidationService
   */
  public static translationValidator(group: FormGroup): ValidationErrors | null {
    const keys = Object.keys(group.value);
    const allEmpty = keys.every(key => !group.value[key]);
    if (!allEmpty) {
      const allFilled = keys.every(key => !!group.value[key]);
      if (!allFilled) {
        return {
          allRequired: true
        };
      }
    }
    return null;
  }
}
