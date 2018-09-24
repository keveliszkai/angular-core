import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  /**
   * @param value The truncatable string.
   * @param limit number of the displayed characters.
   * @default 100
   */
  public transform(value: string, limit: number = 100): string {
    return `${value.substr(0, limit)}${value.length > limit ? '...' : ''}`;
  }
}
