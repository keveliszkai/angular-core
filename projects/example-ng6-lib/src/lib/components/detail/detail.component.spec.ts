/* tslint:disable */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DetailComponent } from './detail.component';

class TestObject {
  constructor(public id: number, public name: string) {}
}

@Component({
  template: ''
})
class TestDetailComponent extends DetailComponent<TestObject> {
  public getModel(): Observable<TestObject> {
    return new Observable<TestObject>(observer => {
      observer.next(new TestObject(10, 'Test Object'));
    });
  }
}

describe('Component: DetailComponent', () => {
  let component: TestDetailComponent;
  let fixture: ComponentFixture<TestDetailComponent>;

  beforeEach(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [TestDetailComponent]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestDetailComponent);

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

  it('can handle fails', fakeAsync(() => {
    const spy = spyOn(component, 'getModel').and.callFake(() => new Observable(o => o.error()));

    component.ngOnInit();
    tick();

    expect(component.loading).toEqual(false);
    expect(component.error).toEqual(true);

    expect(spy.calls.count()).toBe(1);
  }));
});
