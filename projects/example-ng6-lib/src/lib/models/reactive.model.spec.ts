import {} from '@angular/core/testing';
import { ReactiveModel } from './reactive.model';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TestUtils } from './test-utils.model';

class TestClass extends ReactiveModel {
  public id = 0;
  public name = '';
  public displayName = '';
}

describe('Model: ReactiveModel', () => {
  let model: TestClass;

  beforeEach(() => {
    model = new TestClass();
  });

  it('should convert the model to the FormGroup', () => {
    const expectation: FormGroup = new FormGroup({});
    expectation.addControl('name', new FormControl('Joe', { validators: Validators.required }));
    expectation.addControl('displayName', new FormControl('Developer', { validators: Validators.required }));

    model.id = 1;
    model.name = 'Joe';
    model.displayName = 'Developer';

    const result = model.getFormGroup();

    expect(TestUtils.compareFormGroups(result, expectation)).toEqual(true);
  });

  it('should convert the model to FormGroup with exception', () => {
    const expectation: FormGroup = new FormGroup({});
    expectation.addControl('displayName', new FormControl('Developer', { validators: Validators.required }));

    model.id = 1;
    model.name = 'Joe';
    model.displayName = 'Developer';

    const result = model.getFormGroup(['name']);

    expect(TestUtils.compareFormGroups(result, expectation)).toEqual(true);
  });

  it('should convert from FormGroup to model', () => {
    const form = model.getFormGroup();
    const expectation = 'John';

    form.get('name').setValue(expectation);

    model.loadFromFormGroup(form);

    expect(model.name).toEqual(expectation);
  });

  it('should convert from FormGroup to model with exception', () => {
    const falseExpectation = 'Joe';
    const expectation = 'John';
    model.name = expectation;

    const form = model.getFormGroup();

    form.get('name').setValue(falseExpectation);

    model.loadFromFormGroup(form, ['name']);

    expect(model.name).not.toEqual(falseExpectation);
    expect(model.name).toEqual(expectation);
  });

  it('should create Custom FormGroup, with keeping keys', () => {
    const expectation: FormGroup = new FormGroup({});
    expectation.addControl('id', new FormControl(1, { validators: Validators.required }));
    expectation.addControl('displayName', new FormControl('Developer', { validators: Validators.required }));

    model.id = 1;
    model.name = 'Joe';
    model.displayName = 'Developer';

    const result = model.buildForm(['id', 'displayName']);

    expect(TestUtils.compareFormGroups(result, expectation)).toEqual(true);
  });

  it('should create Custom FormGroup, with except keys', () => {
    const expectation: FormGroup = new FormGroup({});
    expectation.addControl('name', new FormControl('Joe', { validators: Validators.required }));

    model.id = 1;
    model.name = 'Joe';
    model.displayName = 'Developer';

    const result = model.buildForm(['id', 'displayName'], true);

    expect(TestUtils.compareFormGroups(result, expectation)).toEqual(true);
  });
});
