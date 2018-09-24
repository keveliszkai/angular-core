import {} from '@angular/core/testing';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TestUtils } from './test-utils.model';

describe('Model: TestUtils', () => {
  it('can compare FormGroups', () => {
    const group1: FormGroup = new FormGroup({});
    group1.addControl('id', new FormControl(1, { validators: Validators.required }));
    group1.addControl('name', new FormControl('Joe', { validators: Validators.required }));
    group1.addControl('displayName', new FormControl('Developer', { validators: Validators.required }));

    const group2: FormGroup = new FormGroup({});
    group2.addControl('id', new FormControl(1, { validators: Validators.required }));
    group2.addControl('name', new FormControl('Joe', { validators: Validators.required }));

    expect(TestUtils.compareFormGroups(group1, group2)).toEqual(false);

    group2.addControl('displayName', new FormControl('Developer', { validators: Validators.required }));

    expect(TestUtils.compareFormGroups(group1, group2)).toEqual(true);
  });
});
