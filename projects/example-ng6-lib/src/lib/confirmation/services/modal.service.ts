import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalService {
  public openYesNoModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  public yesNoModalClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
}
