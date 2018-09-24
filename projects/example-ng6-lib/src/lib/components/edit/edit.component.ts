import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { EditErrorType } from '../../models';
import { BaseComponent } from '../base/base.component';

@Injectable()
/**
 * This is the abstract edit component that can be used in the edit views.
 * This class is highly recommended to use with Template Driven Forms.
 */
export abstract class EditComponent<T> extends BaseComponent implements OnInit {
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
   * Error type.
   */
  public errorType: EditErrorType;

  /**
   * @param options Options, that runs before the first initialize.
   * @example super({preventInit: true});
   */
  constructor(options?: EditComponentOptions) {
    super();

    this.options = {
      preventInit: options && options.preventInit ? options.preventInit : false,
      refreshModelFromResponse: options && options.refreshModelFromResponse ? options.refreshModelFromResponse : true
    };
  }

  /**
   * The original deep copy of the model, that contains the T object. This populates when the request succeeded.
   */
  private originalModel: T;

  /**
   * Options object. This can be added on the sper() call.
   * @example super({preventInit: true});
   */
  protected options: EditComponentOptions;

  /**
   * This event fires, when the model is updated, and the api responded successfully.
   */
  protected afterModelUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * This event fires, when the model is loaded from the api successfully.
   */
  protected afterModelLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Private Initialize.
   */
  public ngOnInit() {
    this.startLoading();

    if (!this.options.preventInit) {
      this.getModel().subscribe(res => this.setModel(res), err => this.errorHandler(err, EditErrorType.FailedToLoadModel));
    }
  }

  /**
   * Public property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  public get disabled(): boolean {
    return this.loading || this.noChange;
  }

  /**
   * Private property that can be used as change detection.
   * @returns {boolean} true if there are no changes.
   */
  protected get noChange(): boolean {
    return JSON.stringify(this.model) === JSON.stringify(this.originalModel);
  }

  /**
   * This function starts the uploading methods. UpdateModel(), refreshModel(), etc...
   */
  public update() {
    this.startLoading();

    if (this.beforeUpdate) {
      this.beforeUpdate();
    }

    this.updateModel().subscribe(
      res => {
        this.options.refreshModelFromResponse ? this.refreshModel(res) : this.reloadModel();
        this.afterModelUpdated.emit(true);
      },
      err => this.errorHandler(err, EditErrorType.FailedToUpdateModel)
    );
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will GET the T model from the api.
   * @returns Observable<T>
   * @example public getModel(): Observable<User> { return this.service.getById(+this.id); }
   */
  protected abstract getModel(): Observable<T>;

  /**
   * The abstract function, that needs to be implemented in the child element. This method will PUT or POST the T model to the api.
   * @returns Observable<T>
   * @example public updateModel(): Observable<User> { return this.service.updateById(this.model, +this.id); }
   */
  protected abstract updateModel(): Observable<T>;

  /**
   * This method repopulates the model and the originalModel. This method uses the loading feature, and loads the model from the backend.
   */
  protected reloadModel() {
    this.startLoading();
    this.getModel().subscribe(res => this.setModel(res), err => this.errorHandler(err, EditErrorType.FailedToLoadModel));
  }

  /**
   * This method populates the model and the originalModel.
   * @param resp Succsessful response from the backend.
   */
  private setModel(resp: T) {
    this.model = resp;
    this.originalModel = _.cloneDeep(resp);

    if (this.beforeModelLoaded) {
      this.beforeModelLoaded();
    }

    this.afterModelLoaded.emit(true);
    this.error = false;
    this.stopLoading();
  }

  /**
   * This method populates the model and the originalModel from the update response.
   * @param resp Succsessful response from the backend.
   */
  private refreshModel(response) {
    return this.setModel(response);
  }

  /**
   * Simple error handler.
   * @param {any} error Error
   * @param {EditErrorType} errorType Type of error
   * @param error Type of error.
   */
  private errorHandler(error: any, errorType: EditErrorType): void {
    console.error(error);
    this.stopLoading();
    this.error = true;
    this.errorType = errorType;
  }
}

export interface EditComponent<T> {
  /**
   * This optional function runs before the private updateModel() function runs.
   */
  beforeUpdate?(): void;

  /**
   * This optional function runs before the afterModelLoaded event emitted.
   */
  beforeModelLoaded(): void;
}

export interface EditComponentOptions {
  /**
   * True, if the first getModel() needs to be prevented.
   * @default false
   */
  preventInit?: boolean;

  /**
   * True, if the model needs to be refreshed from the backend response after the update method.
   * @default true
   */
  refreshModelFromResponse?: boolean;
}
