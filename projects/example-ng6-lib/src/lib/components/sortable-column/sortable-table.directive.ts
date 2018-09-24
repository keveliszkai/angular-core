import { Directive, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SortableColumnService } from './sortable-column.service';

@Directive({
  selector: '[sortable-table]'
})
export class SortableTableDirective implements OnInit, OnDestroy {
  @Output() public sorted = new EventEmitter();

  constructor(private readonly sortService: SortableColumnService) {}

  private columnSortedSubscription: Subscription;

  public ngOnInit() {
    // subscribe to sort changes so we emit and event for this data table
    this.columnSortedSubscription = this.sortService.columnSortedEvent.subscribe(event => {
      this.sorted.emit(event);
    });
  }

  public ngOnDestroy() {
    this.sortService.resetSortings();
    this.columnSortedSubscription.unsubscribe();
  }
}
