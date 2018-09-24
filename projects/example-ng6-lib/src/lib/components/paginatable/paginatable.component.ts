import { EventEmitter } from '@angular/core';

import { PaginateObject } from '../../models';
import { FilterableComponent } from '../filterable/filterable.component';
/**
 * This component can handle the paginator logic.
 *
 * @export
 * @abstract
 * @class PaginatableComponent
 * @extends {FilterableComponent}
 */
export abstract class PaginatableComponent extends FilterableComponent {
  /**
   * Event fires, when pagination changed.
   *
   * @protected
   * @type {EventEmitter<any>}
   * @memberof PaginatableComponent
   */
  protected paginationChanged: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Default page index.
   *
   * @memberof ListComponent
   */
  public readonly defaultPageIndex = 1;

  /**
   * Default page size.
   *
   * @memberof ListComponent
   */
  public readonly defaultPageSize = 10;

  /**
   * Default total number of items.
   *
   * @memberof ListComponent
   */
  public readonly defaultTotal = 0;

  /**
   * This object stores the pagination datas: itemsPerPage, currentPage, totalItems.
   *
   * @type {PaginateObject}
   * @memberof ListComponent
   * @default new PaginateObject(10, 1, 0)
   */
  public paginateObject: PaginateObject = new PaginateObject(this.defaultPageSize, this.defaultPageIndex, this.defaultTotal);

  /**
   * Default datas.
   */
  public readonly smallPage = 5;
  public readonly mediumPage = 10;
  public readonly largePage = 25;
  public readonly maximumPage = 50;

  /**
   * Page limits for the paginator.
   *
   * @memberof ListComponent
   * @default [5, 10, 25, 50]
   */
  public paginateLimits = [this.smallPage, this.mediumPage, this.largePage, this.maximumPage];

  /**
   * This function handles the chaning of the paginator.
   *
   * @protected
   * @param {number} page
   * @memberof ListComponent
   */
  protected pageChange(page: number) {
    this.paginateObject.currentPage = page;
    this.paginationChanged.emit();
  }

  /**
   * This function handles the chaning of the Material paginator.
   *
   * @protected
   * @param {{ pageIndex: number; pageSize: number; length: number }} event
   * @memberof ListComponent
   */
  protected matPageChange(event: { pageIndex: number; pageSize: number; length: number }) {
    this.paginateObject.currentPage = event.pageIndex;
    this.paginateObject.totalItems = event.length;
    this.paginateObject.itemsPerPage = event.pageSize;
    this.paginationChanged.emit();
  }
}
