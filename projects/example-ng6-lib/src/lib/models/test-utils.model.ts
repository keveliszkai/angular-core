import { FormGroup } from '@angular/forms';

/**
 * Extra functions for tests.
 */
export class TestUtils {
  /**
   * Return true, if the the FormGroup is equal.
   */
  public static compareFormGroups(group1: FormGroup, group2: FormGroup): boolean {
    const keys1 = Object.keys(group1.controls);
    const keys2 = Object.keys(group2.controls);

    if (keys1.length !== keys2.length) {
      return false;
    }

    if (keys1.find(i => !keys2.includes(i))) {
      return false;
    }

    if (keys1.find(k => group1.controls[k].value !== group2.controls[k].value)) {
      return false;
    }

    return true;
  }
}
