/* tslint:disable */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ListEditComponent } from './list-edit.component';
import { ListObject } from '../../models/list-object.model';
import { CoreService } from '../../services';

class TestObject {
  constructor(public id: number, public name: string) {}
}

class TestParentObject {
  constructor(public id: number, public name: string) {}
}

@Component({
  template: ''
})
class TestListEditComponent extends ListEditComponent<TestObject, TestParentObject> implements OnInit {
  constructor(coreService: CoreService) {
    super(coreService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public getModel(): Observable<TestParentObject> {
    return new Observable<TestParentObject>(observer => {
      observer.next(new TestParentObject(1, 'parent'));
    });
  }

  public getList(): Observable<ListObject<TestObject>> {
    return new Observable<ListObject<TestObject>>(observer => {
      const resp = [];

      for (let i = 0; i < 100; i++) {
        resp.push(new TestObject(i, i.toString()));
      }

      observer.next(new ListObject<TestObject>(resp, resp.length));
    });
  }

  public changePage(page: number) {
    this.pageChange(page);
  }
}

describe('Component: ListEditComponent', () => {
  let component: TestListEditComponent;
  let fixture: ComponentFixture<TestListEditComponent>;

  beforeEach(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [TestListEditComponent],
      providers: [CoreService]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestListEditComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('has default values', () => {
    expect(component.error).toEqual(false);
    expect(component.loading).toEqual(false);
  });

  it('can change page', () => {
    expect(component.paginateObject.currentPage).toEqual(1);

    component.changePage(3);
    expect(component.paginateObject.currentPage).toEqual(3);

    component.changePage(1);
    expect(component.paginateObject.currentPage).toEqual(1);
  });

  it('can handle fails', () => {
    fakeAsync((comp: TestListEditComponent) => {
      comp.getList = jasmine.createSpy('getList').and.callFake(reject => reject());

      comp.ngOnInit();
      tick();

      expect(comp.loading).toEqual(false);
      expect(comp.error).toEqual(true);

      const spy = fixture.debugElement.injector.get(comp) as any;
      expect(spy.getList.calls.count()).toBe(1);
    });
  });

  it('can load the default model', () => {
    fakeAsync((comp: TestListEditComponent) => {
      const expectation = new TestParentObject(1, 'parent');
      comp.getList = jasmine.createSpy('getList');
      comp.getList = jasmine.createSpy('getModel');

      comp.ngOnInit();
      tick();

      const spy = fixture.debugElement.injector.get(comp) as any;
      expect(spy.getList.calls.count()).toBe(1);
      expect(spy.getModel.calls.count()).toBe(1);

      expect(comp.model).toEqual(expectation);
    });
  });

  it('can fires the afterModelLoaded event.', () => {
    fakeAsync((comp: TestListEditComponent) => {
      comp.getList = jasmine.createSpy('getModel');
      comp.getList = jasmine.createSpy('afterModelLoaded');

      comp.ngOnInit();
      tick();

      const spy = fixture.debugElement.injector.get(comp) as any;
      expect(spy.afterModelLoaded.calls.count()).toBe(1);
      expect(spy.getModel.calls.count()).toBe(1);
    });
  });
});
