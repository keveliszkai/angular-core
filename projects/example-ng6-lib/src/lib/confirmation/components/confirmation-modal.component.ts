import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../services/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent extends ModalComponent {
  constructor(modalService: NgbModal, private readonly sharedModalService: ModalService) {
    super(modalService);
    this.sharedModalService.openYesNoModal.subscribe(() => this.openModal());
  }

  public open() {
    this.openModal();
  }

  public confirm() {
    this.sharedModalService.yesNoModalClosed.emit(true);
    this.closeModal();
  }

  public reject() {
    this.sharedModalService.yesNoModalClosed.emit(false);
    this.closeModal();
  }

  public close() {
    this.closeModal();
  }
}
