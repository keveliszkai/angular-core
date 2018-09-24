import { NgModule } from '@angular/core';
import { UserAuthenticationService } from './services/user-authentication.service';
import { AuthGuard } from './services/auth-guard.service';

@NgModule({
  providers: [UserAuthenticationService, AuthGuard]
})
export class AuthenticationModule {}
