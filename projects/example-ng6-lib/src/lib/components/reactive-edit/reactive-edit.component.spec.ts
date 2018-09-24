/* tslint:disable */
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ReactiveEditComponent } from './reactive-edit.component';
import { ReactiveModel } from '../../models/reactive.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TestUtils } from '../../models/test-utils.model';

class TestObject extends ReactiveModel {
  public id = 0;
  public name = '';

  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }
}

const testData = new TestObject(10, 'John');

@Component({
  template: ''
})
class TestEditComponent extends ReactiveEditComponent<TestObject> {
  constructor() {
    super();
  }

  public getForm(): FormGroup {
    return this.model.getFormGroup();
  }

  public loadModelFromForm(): void {
    return this.model.loadFromFormGroup(this.form);
  }

  public getModel(): Observable<TestObject> {
    return new Observable<TestObject>(observer => {
      observer.next(testData);
    });
  }

  public updateModel(): Observable<TestObject> {
    return new Observable<TestObject>(observer => {
      observer.next(testData);
    });
  }
}

describe('Component: ReactiveEditComponent', () => {
  let component: TestEditComponent;
  let fixture: ComponentFixture<TestEditComponent>;

  beforeEach(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [TestEditComponent]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestEditComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('has correct default values', fakeAsync(() => {
    component.ngOnInit();
    tick();

    const expectationGroup: FormGroup = new FormGroup({});
    expectationGroup.addControl('id', new FormControl(10, { validators: Validators.required }));
    expectationGroup.addControl('name', new FormControl('John', { validators: Validators.required }));

    expect(component.error).toEqual(false);
    expect(component.loading).toEqual(false);

    // Model loaded.
    expect(component.model.id).toEqual(10);
    expect(component.model.name).toEqual('John');

    // Form loaded.
    expect(TestUtils.compareFormGroups(component.form, expectationGroup)).toEqual(true);
  }));

  it('can detect changes (disabled)', fakeAsync(() => {
    component.ngOnInit();
    tick();

    component.form.get('name').setValue('SomeRandomValue');
    component.form.get('name').updateValueAndValidity();
    expect(component.disabled).toEqual(false);

    component.form.get('name').setValue('');
    component.form.get('name').updateValueAndValidity();
    expect(component.disabled).toEqual(true);

    component.form.get('name').setValue('SomeRandomValueAgain');
    component.form.get('name').updateValueAndValidity();
    expect(component.disabled).toEqual(false);
  }));

  it('can handle fails', fakeAsync(() => {
    const spy = spyOn(component, 'getModel').and.callFake(() => new Observable<TestObject>(o => o.error()));

    component.ngOnInit();
    tick();

    expect(component.loading).toEqual(false);
    expect(component.error).toEqual(true);

    expect(spy.calls.count()).toBe(1);
  }));
});
