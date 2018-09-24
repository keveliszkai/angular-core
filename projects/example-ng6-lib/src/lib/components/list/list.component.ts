import { EventEmitter, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ListErrorType, ListObject } from '../../models';
import { ListParameters } from '../../interfaces';
import { CoreService } from '../../services/core.service';
import { PaginatableComponent } from '../paginatable/paginatable.component';

/**
 * This is the abstract main component base of the list components.
 * It has the most features, that is necessary for a listing component.
 *
 * @export
 * @abstract
 * @class ListComponent
 * @extends {BaseComponent}
 * @template T Type of the selected list objects.
 */
export abstract class ListComponent<T> extends PaginatableComponent implements OnInit {
  /**
   * This variable stores the array of T instances.
   *
   * @memberof ListComponent
   * @type T[]
   * @default null
   */
  public list?: T[] = null;

  /**
   * This variable shows if there is any error happend lately.
   *
   * @memberof ListComponent
   * @type boolean
   * @default false
   */
  public error = false;

  /**
   * This property stores the type of the previous error.
   *
   * @type {ListErrorType}
   * @memberof ListComponent
   */
  public errorType: ListErrorType;

  /**
   * This property represents the searching text.
   *
   * @type {string}
   * @memberof ListComponent
   * @default null
   */
  public searchText: string = null;

  /**
   * This subscription stores the loding observable of the list.
   *
   * @protected
   * @type {Subscription}
   * @memberof ListComponent
   */
  protected subscription: Subscription;

  /**
   * This event fires, when the list is loaded.
   *
   * @type {EventEmitter<void>}
   * @memberof ListComponent
   */
  public onListLoaded: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Creates an instance of ListComponent.
   * @memberof ListComponent
   */
  constructor(private readonly coreService: CoreService) {
    super();

    // Subscribe for the refresh list event.
    if (this.coreService) {
      this.destroyableSubscriptions.push(this.coreService.refreshListView.subscribe(() => this.loadList()));
    }

    // Filter or Order changed event
    this.destroyableSubscriptions.push(this.filterChanged.subscribe(() => this.loadList()));

    // Pagination changed event
    this.destroyableSubscriptions.push(this.paginationChanged.subscribe(() => this.loadList()));
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Define an ngOnInit() method to handle any additional initialization tasks.
   *
   * @memberof ListComponent
   */
  public ngOnInit() {
    if (this.onListChanged) {
      this.destroyableSubscriptions.push(
        this.onListChanged().subscribe(response => this.setList(response), err => this.errorHandler(err, ListErrorType.FailedToRefreshList))
      );
    }

    this.loadList();
  }

  /**
   * This function reloads the list content. This can be called from the search input.
   *
   * @memberof ListComponent
   */
  public onChange() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      delete this.subscription;
    }

    this.loadList();
  }

  /**
   * This is the must have function of this component. This contains the main source of the model list.
   *
   * @protected
   * @abstract
   * @returns {Observable<ListObject<T>>}
   * @memberof ListComponent
   */
  protected abstract getList(): Observable<ListObject<T>>;

  /**
   * This getter gives the object, that contains: Filters, orders, searchtext, paginator datas
   * for the API call. This can be used as query data.
   *
   * @readonly
   * @protected
   * @type {object}
   * @memberof ListComponent
   */
  protected get getParameters(): ListParameters {
    const resp: ListParameters = {
      page: this.paginateObject.currentPage,
      size: this.paginateObject.itemsPerPage,
      order: {},
      search: this.searchText,
      filter: {}
    };

    // remove search if no text.
    if (!this.searchText) {
      delete resp.search;
    }

    // Adding the orders to the response object.
    if (this.orders) {
      this.orders.forEach(element => {
        resp.order[element.sortColumn] = element.sortDirection;
      });
    } else {
      // Or deletes it, if there are no orders.
      delete resp.order;
    }

    // Adding the filters to the response object.
    if (this.filters) {
      this.filters.forEach(element => {
        resp.filter[element.key] = element.value;
      });
    } else {
      // Or deletes it, if there are no filters.
      delete resp.filter;
    }

    return resp;
  }

  /**
   * This function loads the list from the API call.
   *
   * @protected
   * @memberof ListComponent
   */
  protected loadList() {
    this.startLoading();
    this.subscription = this.getList().subscribe(
      response => this.setList(response),
      err => this.errorHandler(err, ListErrorType.FailedToLoadList)
    );
  }

  /**
   * This function fills the list property and stops the loader.
   *
   * @private
   * @param {ListObject<T>} response
   * @memberof ListComponent
   */
  private setList(response: ListObject<T>) {
    this.list = response.data;
    this.paginateObject.totalItems = response.count;
    this.onListLoaded.emit();
    this.stopLoading();
    delete this.subscription;
  }

  /**
   * Simple error handler.
   *
   * @private
   * @param {any} error Error
   * @param {ListErrorType} errorType Type of error
   * @memberof ListComponent
   */
  private errorHandler(error: any, errorType: ListErrorType): void {
    console.error(error);
    this.stopLoading();
    this.error = true;
    this.errorType = errorType;
    delete this.subscription;
  }
}

/**
 * This interface contains the optional functions of the ListComponent<T>
 *
 * @export
 * @interface ListComponent
 * @template T
 */
export interface ListComponent<T> {
  // Optional methods

  /**
   * @returns {EventEmitter<ListObject<T>>}
   * @memberof ListComponent
   */
  onListChanged?(): EventEmitter<ListObject<T>>;
}
