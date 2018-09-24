import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

export abstract class /**
 * This is the abstract base component that has the following features:
 * Loading, Automatic loading stopper, Automatic subscription unsubscriber.
 */
BaseComponent implements OnDestroy {
  /**
   * Loading property. This variable stores the current status of the loader.
   */
  public _loading = false;

  /**
   * Timeaout. After the given time elapsed, the loader stops immediately. The value stores the time in ms!
   * @default 5000 ms
   */
  public loadingTimeout = 5000;

  /**
   * The subscriptions in this array will unsubscribe during the ngOnDestroy() method.
   */
  protected destroyableSubscriptions: Subscription[] = [];

  /**
   * This property needs for reset the setTimeout method.
   */
  private timeoutHandler;

  public ngOnDestroy() {
    this.destroyableSubscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Public interface of the _loading private property. Current status of the loader.
   */
  public get loading(): boolean {
    return this._loading;
  }

  /**
   * This method starts the loader. After `loadingTimeout` ms it will stops the loading.
   */
  public startLoading() {
    this._loading = true;
    this.timeoutHandler = setTimeout(() => this.stopLoading(), this.loadingTimeout);
  }

  /**
   * This method stops the loader.
   */
  public stopLoading() {
    clearTimeout(this.timeoutHandler);
    this._loading = false;
  }
}
