import { EventEmitter } from '@angular/core';

import { ColumnSortedEvent } from '../sortable-column';
import { BaseComponent } from '../base/base.component';
import { KeyValue } from '../../interfaces/key-value.interface';
/**
 * This component can handle the sorting logic.
 *
 * @export
 * @abstract
 * @class FilterableComponent
 * @extends {BaseComponent}
 */
export abstract class FilterableComponent extends BaseComponent {
  /**
   * Fires, when the filter, or the order changed.
   *
   * @protected
   * @type {EventEmitter<any>}
   * @memberof FilterableComponent
   */
  protected filterChanged: EventEmitter<any> = new EventEmitter<any>();

  /**
   * This array contains the orders.
   *
   * @type {ColumnSortedEvent[]}
   * @memberof ListComponent
   * @default []
   */
  public orders: ColumnSortedEvent[] = [];

  /**
   * This array contains the filters.
   *
   * @type {KeyValue[]}
   * @memberof ListComponent
   * @default []
   */
  public filters: KeyValue[] = [];

  // ---------------------------------------------------------------------------
  // FITLER
  // ---------------------------------------------------------------------------

  /**
   * This function adds a new filter, or updates it, then refreshing the list.
   *
   * @public
   * @param {KeyValue} filter
   * @memberof ListComponent
   */
  public addOrUpdateFilter(filter: KeyValue) {
    this.addOrUpdateFilterNoRefresh(filter);
    this.filterChanged.emit();
  }

  /**
   * This function adds a new filter, or updates it, without refreshing the list.
   *
   * @protected
   * @param {KeyValue} filter
   * @memberof ListComponent
   */
  protected addOrUpdateFilterNoRefresh(filter: KeyValue) {
    this.filters = this.filters.filter(i => i.key !== filter.key);
    this.filters.push(filter);
  }

  /**
   * This function clears one filter from filters array, then refreshes the list.
   *
   * @protected
   * @param {string} key
   * @memberof ListComponent
   */
  protected removeFilter(key: string) {
    this.removeFilterNoRefresh(key);
    this.filterChanged.emit();
  }

  /**
   * This function clears one filter from filters array, without refreshing the list.
   *
   * @protected
   * @param {string} key
   * @memberof ListComponent
   */
  protected removeFilterNoRefresh(key: string) {
    this.filters = this.filters.filter(i => i.key !== key);
  }

  /**
   * This function clears the filters array.
   *
   * @protected
   * @memberof ListComponent
   */
  protected clearFilter() {
    this.filters = [];
    this.filterChanged.emit();
  }

  /**
   * This function handles the chaning of the filters.
   *
   * @protected
   * @param {Filter[]} event
   * @memberof ListComponent
   */
  protected filterChange(event: KeyValue[]) {
    this.filters = event;
    this.filterChanged.emit();
  }

  // ---------------------------------------------------------------------------
  // ORDER
  // ---------------------------------------------------------------------------

  /**
   * This function adds a new order, or updates it.
   *
   * @protected
   * @param {string} key
   * @param {string} [value='DESC']
   * @memberof ListComponent
   */
  protected setOneOrder(key: string, value = 'DESC') {
    this.orders = [];
    this.orders.push({ sortColumn: key, sortDirection: value });
    this.filterChanged.emit();
  }

  /**
   * This function clears the orders array.
   *
   * @protected
   * @memberof ListComponent
   */
  protected clearOrder() {
    this.orders = [];
    this.filterChanged.emit();
  }

  /**
   * This function handles the chaning of the orders.
   *
   * @protected
   * @param {ColumnSortedEvent[]} event
   * @memberof ListComponent
   */
  protected orderChange(event: ColumnSortedEvent[]) {
    this.orders = event;
    this.filterChanged.emit();
  }
}
