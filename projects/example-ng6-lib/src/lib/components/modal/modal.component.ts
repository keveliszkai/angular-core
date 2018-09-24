import { TemplateRef, ViewChild, Injectable } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../base/base.component';

@Injectable()
export class ModalComponent extends BaseComponent {
  /**
   * Reference to the actual template. This uses 'template' as template name.
   */
  @ViewChild('template')
  public template: TemplateRef<any>;

  constructor(protected modalService: NgbModal) {
    super();
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
}

export interface ModalComponent {
  /**
   * This function starts during the modal is closing.
   */
  beforeClose?(): void;

  /**
   * This function starts during the modal is opening.
   */
  beforeOpen?(): void;
}
