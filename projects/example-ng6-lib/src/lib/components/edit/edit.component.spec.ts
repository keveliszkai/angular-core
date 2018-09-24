/* tslint:disable */
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EditComponent } from './edit.component';

class TestObject {
  constructor(public id: number, public name: string) {}
}

const testData = new TestObject(10, 'Test Object');

@Component({
  template: ''
})
class TestEditComponent extends EditComponent<TestObject> {
  constructor() {
    super();
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

describe('Component: EditComponent', () => {
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

    expect(component.error).toEqual(false);
    expect(component.loading).toEqual(false);

    expect(component.model.id).toEqual(10);
    expect(component.model.name).toEqual('Test Object');
  }));

  it('can detect changes', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.disabled).toEqual(true);

    const originalName = component.model.name;
    component.model.name += '!';
    expect(component.disabled).toEqual(false);

    component.model.name = originalName;
    expect(component.disabled).toEqual(true);
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
