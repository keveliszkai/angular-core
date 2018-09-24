import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ListComponent } from '../list/list.component';
import { CoreService } from '../../services';

@Injectable()
/**
 * This is the abstract list component that can be used for listing a parent model sub-models.
 */
export abstract class ListEditComponent<T, V> extends ListComponent<T> implements OnInit {
  /**
   * The parent model mostly has id. This can be string or number.
   */
  public id: string | number;

  /**
   * The parent model, that contains the V object.
   */
  public model: V;

  constructor(coreService: CoreService) {
    super(coreService);
  }

  /**
   * This event fires, when the parent model is loaded from the api successfully.
   */
  protected afterModelLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Private Initialize.
   */
  public ngOnInit() {
    this.startLoading();

    this.getModel().subscribe(result => {
      this.setModel(result);
      super.ngOnInit();
    });
  }

  /**
   * The abstract function, that needs to be implemented in the child element. This method will GET the V parent model from the api.
   * @returns Observable<V>
   * @example public getModel(): Observable<User> { return this.service.getById(+this.id); }
   */
  protected abstract getModel(): Observable<V>;

  /**
   * This method populates the parent model.
   * @param resp Succsessful response from the backend.
   */
  private setModel(resp: V) {
    this.model = resp;

    if (this.beforeModelLoaded) {
      this.beforeModelLoaded();
    }

    this.afterModelLoaded.emit(true);
  }
}

export interface ListEditComponent<T, V> {
  /**
   * This optional function runs before the afterModelLoaded event emitted.
   */
  beforeModelLoaded(): void;
}
