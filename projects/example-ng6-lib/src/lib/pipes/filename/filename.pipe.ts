import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {
  /**
   * @param value The full file path.
   */
  public transform(value: string): string {
    // Linux trim
    let index = value.lastIndexOf('/');
    let result = index >= 0 ? value.substr(index + 1) : value;

    // Windows trim
    index = result.lastIndexOf('\\');
    result = index >= 0 ? value.substr(index + 1) : result;

    return result;
  }
}
