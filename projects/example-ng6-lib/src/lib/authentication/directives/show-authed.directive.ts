import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserAuthenticationService } from '../services/user-authentication.service';

/**
 * This directive displays the given component, if it has authentication.
 *
 * @example <div *appShowAuthed="true"></div>
 * @export
 * @class ShowAuthedDirective
 * @implements {OnInit}
 */
@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective implements OnInit {
  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly userService: UserAuthenticationService,
    private readonly viewContainer: ViewContainerRef
  ) {}

  private condition: boolean;

  public ngOnInit() {
    this.userService.isAuthenticated.subscribe(isAuthenticated => {
      if ((isAuthenticated && this.condition) || (!isAuthenticated && !this.condition)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  @Input()
  set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }
}
