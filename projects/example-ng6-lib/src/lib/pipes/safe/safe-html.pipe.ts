import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
/**
 * Makes the HTML string into trustable.
 *
 * @export
 * @class SafeHtmlPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}
  public transform(url): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(url);
  }
}
