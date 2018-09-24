import { NgModule } from '@angular/core';
import { PermissionService } from './services/permission.service';
import { CanActivateDirective } from './directives/can-activate.directive';
import { CanEditDirective } from './directives/can-edit.directive';

@NgModule({
  declarations: [CanActivateDirective, CanEditDirective],
  exports: [CanActivateDirective, CanEditDirective],
  providers: [PermissionService]
})
export class PermissionModule {}
