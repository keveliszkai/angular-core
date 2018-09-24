import { NgModule } from '@angular/core';
import { ConfirmDirective } from './directives/confirm.directive';
import { ModalService } from './services/modal.service';

@NgModule({
  declarations: [ConfirmDirective],
  exports: [ConfirmDirective],
  providers: [ModalService]
})
export class ConfirmationModule {}
