/* tslint:disable */
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CreateComponent } from './create.component';

class TestObject {
  constructor(public id: number, public name: string) {}
}

const testData = new TestObject(10, 'Test Object');

@Component({
  template: ''
})
class TestCreateComponent extends CreateComponent<TestObject> {
  public initModel(): TestObject {
    return testData;
  }

  public createModel(): Observable<TestObject> {
    return new Observable<TestObject>(observer => {
      observer.next(testData);
    });
  }
}

describe('Component: CreateComponent', () => {
  let component: TestCreateComponent;
  let fixture: ComponentFixture<TestCreateComponent>;

  beforeEach(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [TestCreateComponent]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestCreateComponent);

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

  it('can update model', fakeAsync(() => {
    component.ngOnInit();
    tick();

    component.create();
    tick();

    expect(component.error).toEqual(false);
    expect(component.loading).toEqual(false);
  }));

  it('can handle fails', fakeAsync(() => {
    const spy = spyOn(component, 'createModel').and.callFake(() => new Observable(o => o.error()));

    component.ngOnInit();
    tick();

    component.create();
    tick();

    component.ngOnInit();
    tick();

    expect(component.loading).toEqual(false);
    expect(component.error).toEqual(true);

    expect(spy.calls.count()).toBe(1);
  }));
});
