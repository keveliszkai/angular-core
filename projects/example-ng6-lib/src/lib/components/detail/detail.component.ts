import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DetailErrorType } from '../../models';
import { BaseComponent } from '../base/base.component';

@Injectable()
/**
 * This is the abstract detail component that can be used in the detail views.
 */
export abstract class DetailComponent<T> extends BaseComponent implements OnInit {
  /**
   * The model mostly has id. This can be string or number.
   */
  public id: string | number;

  /**
   * The model, that contains the T object.
   */
  public model: T = null;

  /**
   * Error flag.
   */
  public error = false;

  /**
   * Error type.
   */
  public errorType: DetailErrorType;

  constructor() {
    super();
  }

  public ngOnInit() {
    this.startLoading();

    if (this.onModelChanged) {
      this.onModelChanged().subscribe(model => this.setModel(model), err => this.errorHandler(err, DetailErrorType.FailedToRefreshModel));
    }

    this.getModel().subscribe(model => this.setModel(model), err => this.errorHandler(err, DetailErrorType.FailedToLoadModel));
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will get the T model from the api.
   * @returns Observable<T>
   */
  protected abstract getModel(): Observable<T>;

  /**
   * This method repopulates the model. This method uses the loading feature, and loads the model from the backend.
   */
  protected refreshModel() {
    this.getModel();
  }

  /**
   * This method populates the model and the originalModel.
   * @param resp Succsessful response from the backend.
   */
  private setModel(response: T) {
    this.model = response;
    this.stopLoading();
  }

  /**
   * Simple error handler.
   * @param {any} error Error
   * @param {DetailErrorType} errorType Type of error
   */
  private errorHandler(error: any, errorType: DetailErrorType): void {
    console.error(error);
    this.stopLoading();
    this.error = true;
    this.errorType = errorType ? errorType : error;
  }
}

export interface DetailComponent<T> {
  // Optional methods
  onModelChanged?(): EventEmitter<T>;
}
