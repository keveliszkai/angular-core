import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../base/base.component';

@Injectable()
/**
 * This is the abstract create component that can be used in the create views.
 */
export abstract class CreateComponent<T> extends BaseComponent implements OnInit {
  /**
   * The model, that contains the T object.
   */
  public model: T;

  /**
   * Error flag.
   */
  public error = false;

  constructor() {
    super();
  }

  /**
   * This method runs before onInit() method.
   */
  public ngOnInit() {
    this.model = this.initModel();
  }

  /**
   * This method starts the createModel() method. Starts the POST request.
   */
  public create() {
    this.startLoading();

    if (this.beforeCreate) {
      this.beforeCreate();
    }

    this.createModel().subscribe(res => this.created(res), err => this.errorHandler(err));
  }

  /**
   * This function populates the model with a new Instance.
   */
  protected abstract initModel(): T;

  /**
   * This function will post the model to the API.
   */
  protected abstract createModel(): Observable<T>;

  /**
   * This method runs, when the create method completed.
   * @param resp Response from the API. This response will refresh the model.
   */
  private created(resp: T) {
    this.model = resp;
    this.error = false;
    this.stopLoading();

    if (this.afterCreated) {
      this.afterCreated();
    }
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

export interface CreateComponent<T> {
  // Optional methods

  /**
   * This function runs after the model is created, and got a successful response from the api.
   */
  afterCreated?(): void;

  /**
   * This optional function runs before the private createModel() function runs.
   */
  beforeCreate?(): void;
}
