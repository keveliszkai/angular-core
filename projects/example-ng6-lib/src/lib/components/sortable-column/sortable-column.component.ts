import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';

import { SortableColumnService } from './sortable-column.service';

@Component({
  selector: '[sortable-column]',
  templateUrl: './sortable-column.component.html'
})
export class SortableColumnComponent implements OnInit, OnDestroy {
  @Input()
  public sortableColumn: string;

  @Input()
  public sortDirection: string = null;

  constructor(private readonly sortService: SortableColumnService) {}

  @HostListener('click')
  public sort() {
    switch (this.sortDirection) {
      case 'asc':
        this.sortDirection = 'desc';
        break;
      case 'desc':
        this.sortDirection = '';
        break;
      default:
        this.sortDirection = 'asc';
    }

    this.sortService.columnSorted({
      sortColumn: this.sortableColumn,
      sortDirection: this.sortDirection
    });
  }

  public ngOnInit() {
    if (this.sortDirection) {
      this.sortService.columnSorted({
        sortColumn: this.sortableColumn,
        sortDirection: this.sortDirection
      });
    }
  }

  public ngOnDestroy() {}
}
