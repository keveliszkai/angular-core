import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
/**
 * Makes the url into trust resource url.
 *
 * @export
 * @class SafePipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}
  public transform(url): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
