import { TemplateRef, ViewChild, Injectable } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { EditComponent, EditComponentOptions } from '../edit/edit.component';

@Injectable()
export abstract class EditModalComponent<T> extends EditComponent<T> {
  /**
   * Reference to the actual template. This uses 'template' as template name.
   */
  @ViewChild('template')
  public template: TemplateRef<any>;

  constructor(protected modalService: NgbModal, options?: EditComponentOptions) {
    super(options);
  }

  /**
   * Reference (ModalRef) to the actual modal.
   */
  private modalRef: NgbModalRef;

  /**
   * This function calls, when the modal starts opening.
   */
  public openModal() {
    if (this.beforeOpen) {
      this.beforeOpen();
    }
    this.modalRef = this.modalService.open(this.template);
  }

  /**
   * This function calls, when the modal starts closing.
   */
  public closeModal() {
    if (this.beforeClose) {
      this.beforeClose();
    }
    this.modalRef.close();
    this.modalRef = null;
  }

  protected abstract updateModel(): Observable<T>;
}

export interface EditModalComponent<T> {
  /**
   * This function starts during the modal is closing.
   */
  beforeClose?(): void;

  /**
   * This function starts during the modal is opening.
   */
  beforeOpen?(): void;
}
