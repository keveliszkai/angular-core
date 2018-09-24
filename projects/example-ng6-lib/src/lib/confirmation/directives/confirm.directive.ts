import { EventEmitter, Directive, Output, HostListener } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[confirm]'
})
export class ConfirmDirective {
  @Output() public confirm = new EventEmitter<any>();
  public subscription: Subscription;

  constructor(private readonly sharedModalService: ModalService) {}

  @HostListener('click')
  public onClick() {
    this.open();
  }

  public open() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.sharedModalService.openYesNoModal.emit(true);

    this.subscription = this.sharedModalService.yesNoModalClosed.subscribe((success: boolean) => {
      success ? this.confirm.emit() : this.subscription.unsubscribe();
    });
  }
}
