/* tslint:disable */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ListComponent } from './list.component';
import { ListObject } from '../../models/list-object.model';
import { KeyValue, ListParameters } from '../../interfaces';
import { ColumnSortedEvent } from '../sortable-column';
import { CoreService } from '../../services';

class TestObject {
  constructor(public id: number, public name: string) {}
}

@Component({
  template: ''
})
class TestListComponent extends ListComponent<TestObject> {
  constructor(coreService: CoreService) {
    super(coreService);
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
  public loadListM() {
    this.loadList();
  }

  public addOrUpdateFilterM(value: KeyValue) {
    this.addOrUpdateFilter(value);
  }

  public addOrUpdateFilterNoRefreshM(value: KeyValue) {
    this.addOrUpdateFilterNoRefresh(value);
  }

  public clearFilterM() {
    this.clearFilter();
  }

  public removeFilterM(value: string) {
    this.removeFilter(value);
  }

  public clearOrderM() {
    this.clearOrder();
  }

  public orderChangeM(event: ColumnSortedEvent[]) {
    this.orderChange(event);
  }

  public setOneOrderM(key: string, value: string) {
    this.setOneOrder(key, value);
  }

  public get parametersM(): ListParameters {
    return this.getParameters;
  }
}

describe('Component: ListComponent', () => {
  let component: TestListComponent;
  let fixture: ComponentFixture<TestListComponent>;

  // ---------------------------------------------------------------------------
  // BASICS
  // ---------------------------------------------------------------------------

  beforeEach(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [TestListComponent],
      providers: [CoreService]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestListComponent);

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
    fakeAsync((comp: TestListComponent) => {
      comp.getList = jasmine.createSpy('getList').and.callFake(reject => reject());

      comp.ngOnInit();
      tick();

      expect(comp.loading).toEqual(false);
      expect(comp.error).toEqual(true);

      const spy = fixture.debugElement.injector.get(comp) as any;
      expect(spy.getList.calls.count()).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------
  it('can handle search', () => {
    fakeAsync((comp: TestListComponent) => {
      const expectation = 'SearchText';
      comp.getList = jasmine.createSpy('getList').and.callFake(reject => reject());

      comp.ngOnInit();
      tick();

      // Fire refresh.
      comp.searchText = expectation;
      comp.onChange();

      const spy = fixture.debugElement.injector.get(comp) as any;
      expect(spy.getList.calls.count()).toBe(2);

      const sentText = comp.parametersM.search;
      expect(sentText).toEqual(expectation);
    });
  });

  // ---------------------------------------------------------------------------
  // FILTER
  // ---------------------------------------------------------------------------
  it('can adds and updates filter', () => {
    const filter: KeyValue = {
      key: 'filter',
      value: 'filter'
    };

    const newFilter: KeyValue = {
      key: 'filter',
      value: 'filter2'
    };

    expect(component.filters).toEqual([]);

    component.addOrUpdateFilterM(filter);
    expect(component.filters).toEqual([filter]);

    component.addOrUpdateFilterM(newFilter);
    expect(component.filters).toEqual([newFilter]);
  });

  it('can adds and updates filter without refresh', () => {
    fakeAsync((comp: TestListComponent) => {
      const filter: KeyValue = {
        key: 'filter',
        value: 'filter'
      };

      const newFilter: KeyValue = {
        key: 'filter',
        value: 'filter2'
      };

      comp.getList = jasmine.createSpy('getList').and.callFake(reject => reject());

      comp.ngOnInit();
      tick();

      expect(component.filters).toEqual([]);

      component.addOrUpdateFilterM(filter);
      expect(component.filters).toEqual([filter]);
      tick();

      component.addOrUpdateFilterNoRefreshM(newFilter);
      expect(component.filters).toEqual([newFilter]);
      tick();

      const spy = fixture.debugElement.injector.get(comp) as any;
      expect(spy.getList.calls.count()).toBe(2);
    });
  });

  it('can remove filter', () => {
    const filter: KeyValue = {
      key: 'filter',
      value: 'filter'
    };

    const newFilter: KeyValue = {
      key: 'filter2',
      value: 'filter2'
    };

    expect(component.filters).toEqual([]);

    component.addOrUpdateFilterM(filter);
    component.addOrUpdateFilterM(newFilter);
    expect(component.filters).toEqual([filter, newFilter]);

    component.removeFilterM(newFilter.key);
    expect(component.filters).toEqual([filter]);
  });

  it('can clear filters', () => {
    const filter: KeyValue = {
      key: 'filter',
      value: 'filter'
    };

    const newFilter: KeyValue = {
      key: 'filter2',
      value: 'filter2'
    };

    expect(component.filters).toEqual([]);

    component.addOrUpdateFilterM(filter);
    component.addOrUpdateFilterM(newFilter);
    expect(component.filters).toEqual([filter, newFilter]);

    component.clearFilterM();
    expect(component.filters).toEqual([]);
  });

  // ---------------------------------------------------------------------------
  // ORDER
  // ---------------------------------------------------------------------------
  it('can adds and updates order', () => {
    const order: ColumnSortedEvent = {
      sortColumn: 'order',
      sortDirection: 'ASC'
    };

    const newOrder: ColumnSortedEvent = {
      sortColumn: 'order',
      sortDirection: 'DESC'
    };

    expect(component.orders).toEqual([]);

    component.setOneOrderM(order.sortColumn, order.sortDirection);
    expect(component.orders).toEqual([order]);

    component.setOneOrderM(newOrder.sortColumn, newOrder.sortDirection);
    expect(component.orders).toEqual([newOrder]);
  });

  it('can clear orders', () => {
    const order: ColumnSortedEvent = {
      sortColumn: 'order',
      sortDirection: 'ASC'
    };

    expect(component.orders).toEqual([]);

    component.setOneOrderM(order.sortColumn, order.sortDirection);
    expect(component.orders).toEqual([order]);

    component.clearOrderM();
    expect(component.orders).toEqual([]);
  });

  it('can add multiple orders', () => {
    const order: ColumnSortedEvent = {
      sortColumn: 'order',
      sortDirection: 'ASC'
    };

    const order2: ColumnSortedEvent = {
      sortColumn: 'order',
      sortDirection: 'DESC'
    };

    expect(component.orders).toEqual([]);

    component.orderChangeM([order, order2]);
    expect(component.orders).toEqual([order, order2]);
  });
});
