/*tslint:disable*/
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, EventEmitter, Injectable } from '@angular/core';

import { BaseComponent } from './base.component';

@Injectable()
class TestBaseService {
  public eventA: EventEmitter<any> = new EventEmitter<any>();
  public eventB: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  template: ''
})
class TestBaseComponent extends BaseComponent {
  constructor(service: TestBaseService) {
    super();

    this.destroyableSubscriptions.push(service.eventA.subscribe(() => this.eventHandlerA()));
    this.destroyableSubscriptions.push(service.eventB.subscribe(() => this.eventHandlerB()));
  }

  public eventHandlerA() {
    return null;
  }
  public eventHandlerB() {
    return null;
  }

  public onInit() {
    return null;
  }

  public onDestroy() {
    return null;
  }
}

describe('Component: BaseComponent', () => {
  let component: TestBaseComponent;
  let fixture: ComponentFixture<TestBaseComponent>;

  const service: TestBaseService = new TestBaseService();

  let originalTimeout: number;

  beforeEach(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      declarations: [TestBaseComponent],
      providers: [{ provide: TestBaseService, useValue: service }]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(TestBaseComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create the component', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('has default values', () => {
    expect(component.loading).toEqual(false);
  });

  it('can change starts and stops the loading', () => {
    expect(component.loading).toEqual(false);

    // Simple trigger
    component.startLoading();
    expect(component.loading).toEqual(true);

    component.stopLoading();
    expect(component.loading).toEqual(false);

    // Double trigger
    component.startLoading();
    expect(component.loading).toEqual(true);

    component.startLoading();
    expect(component.loading).toEqual(true);

    component.stopLoading();
    expect(component.loading).toEqual(false);

    component.stopLoading();
    expect(component.loading).toEqual(false);
  });

  it('can handle fails', (done: DoneFn) => {
    // Simple trigger
    component.startLoading();
    expect(component.loading).toEqual(true);

    setTimeout(() => {
      expect(component.loading).toEqual(true);
    }, component.loadingTimeout - 1000);

    setTimeout(() => {
      expect(component.loading).toEqual(false);
      done();
    }, component.loadingTimeout + 1000);
  });

  it('can use the onDestroy method.', fakeAsync(() => {
    const spy = spyOn(component, 'ngOnDestroy').and.callFake(() => null);

    component.ngOnDestroy();
    tick();

    expect(spy.calls.count()).toEqual(1);
  }));

  it('can unsubscribe from the subscriptions', fakeAsync(() => {
    const spyA = spyOn(component, 'eventHandlerA').and.callFake(() => null);
    const spyB = spyOn(component, 'eventHandlerB').and.callFake(() => null);

    component.onInit();
    tick();

    expect(spyA.calls.count()).toEqual(0);
    expect(spyB.calls.count()).toEqual(0);

    service.eventA.emit();
    expect(spyA.calls.count()).toEqual(1);
    expect(spyB.calls.count()).toEqual(0);

    service.eventB.emit();
    expect(spyA.calls.count()).toEqual(1);
    expect(spyB.calls.count()).toEqual(1);

    service.eventA.emit();
    expect(spyA.calls.count()).toEqual(2);
    expect(spyB.calls.count()).toEqual(1);

    service.eventB.emit();
    expect(spyA.calls.count()).toEqual(2);
    expect(spyB.calls.count()).toEqual(2);

    // Unsubscribe
    component.ngOnDestroy();
    tick();

    service.eventA.emit();
    expect(spyA.calls.count()).toEqual(2);
    expect(spyB.calls.count()).toEqual(2);

    service.eventB.emit();
    expect(spyA.calls.count()).toEqual(2);
    expect(spyB.calls.count()).toEqual(2);
  }));
});
