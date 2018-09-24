import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SortableColumnService {
  public columnSortedEvent: Observable<ColumnSortedEvent[]>;

  constructor() {
    this.columnSortedEvent = this.columnSortedSource.asObservable();
  }

  private readonly columnSortedSource = new Subject<ColumnSortedEvent[]>();

  private orderObject: ColumnSortedEvent[] = [];

  public columnSorted(event: ColumnSortedEvent) {
    if (event.sortColumn) {
      const obj = this.orderObject.filter(i => i.sortColumn === event.sortColumn)[0];
      if (this.orderObject.indexOf(obj) !== -1) {
        this.orderObject[this.orderObject.indexOf(obj)].sortDirection = event.sortDirection;

        if (event.sortDirection === '') {
          this.orderObject = this.orderObject.filter(i => i.sortColumn !== obj.sortColumn);
        }
      } else {
        this.orderObject.push(event);
      }
    }

    this.columnSortedSource.next(this.orderObject);
  }

  public resetSortings(): void {
    this.orderObject = [];
  }
}

export interface ColumnSortedEvent {
  sortColumn: string;
  sortDirection: string;
}
