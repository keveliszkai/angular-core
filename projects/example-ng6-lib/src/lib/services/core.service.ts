import { Injectable, EventEmitter } from '@angular/core';

/**
 * Global service provided by the CoreApp. Here, you can do core functions, shuch as refresh certain views.
 *
 * @export
 * @class CoreService
 */
@Injectable()
export class CoreService {
  /**
   * This event refreshes the list views of the application.
   *
   * @type {EventEmitter<boolean>}
   * @memberof CoreService
   */
  public refreshListView: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * This event refreshes the detail/show views.
   *
   * @type {EventEmitter<boolean>}
   * @memberof CoreService
   */
  public refreshDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();
}
