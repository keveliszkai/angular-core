import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { take, map } from 'rxjs/operators';

import { UserAuthenticationService } from './user-authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly userService: UserAuthenticationService) {}

  public canActivate(): Observable<boolean> {
    return this.userService.isAuthenticated.pipe(
      take(1),
      map(authenticated => {
        if (!authenticated) {
          this.router.navigate(['login']);
        }
        return authenticated;
      })
    );
  }

  public canActivateChild(): Observable<boolean> {
    return this.userService.isAuthenticated.pipe(take(1));
  }
}
