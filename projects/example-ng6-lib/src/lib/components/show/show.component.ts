import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../base/base.component';

@Injectable()
/**
 * This is the abstract show component that can be used in the show views. This class is highly recommended to use in the client side.
 */
export abstract class ShowComponent<T> extends BaseComponent implements OnInit {
  /**
   * The model mostly has id. This can be string or number.
   */
  public id: string | number;

  /**
   * The model, that contains the T object.
   */
  public model: T;

  /**
   * Error flag.
   */
  public error = false;

  /**
   * This event fires, when the model is loaded from the api successfully.
   */
  protected afterModelLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Private Initialize.
   */
  public ngOnInit() {
    this.startLoading();
    this.getModel().subscribe(res => this.setModel(res), err => this.errorHandler(err));
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will GET the T model from the api.
   * @returns Observable<T>
   * @example public getModel(): Observable<User> { return this.service.getById(+this.id); }
   */
  protected abstract getModel(): Observable<T>;

  /**
   * This method repopulates the model and the originalModel. This method uses the loading feature, and loads the model from the backend.
   */
  protected reloadModel() {
    this.startLoading();
    this.getModel().subscribe(res => this.setModel(res), err => this.errorHandler(err));
  }

  /**
   * This method populates the model and the originalModel.
   * @param resp Succsessful response from the backend.
   */
  private setModel(resp: T) {
    this.model = resp;

    if (this.beforeModelLoaded) {
      this.beforeModelLoaded();
    }

    this.afterModelLoaded.emit(true);
    this.stopLoading();
  }

  /**
   * Simple error handler.
   * @param {any} error Error
   */
  private errorHandler(error: any): void {
    console.error(error);
    this.stopLoading();
    this.error = true;
  }
}

export interface ShowComponent<T> {
  /**
   * This optional function runs before the afterModelLoaded event emitted.
   */
  beforeModelLoaded(): void;
}
