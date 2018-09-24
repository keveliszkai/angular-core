import { Injectable } from '@angular/core';
import { TranslatableProperty } from '../language/models/translatable-property.model';
import { LanguageService } from '../language/services/language.service';

/**
 * This service creates slugs.
 *
 * @export
 * @class SlugService
 */
@Injectable()
export class SlugService {
  constructor(private readonly languageService: LanguageService) {}

  /**
   * Creates slug from a translatable property, according to the currentLang.
   *
   * @param {TranslatableProperty} name
   * @returns
   * @memberof SlugService
   */
  public slugifyTranslatableProperty(name: TranslatableProperty) {
    return this.slugify(name.get(this.languageService.currentLang));
  }

  /**
   * Slugify one input.
   *
   * @param {*} input
   * @returns
   * @memberof SlugService
   */
  public slugify(input) {
    if (!input) {
      return;
    }
    const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
    const to = 'aaaaaeeeeeiiiiooooouuuunc------';

    for (let i = 0, len = from.length; i < len; i++) {
      input = input.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    return input
      .toString() // Cast to string
      .toLowerCase() // Convert the string to lowercase letters
      .trim() // Remove whitespace from both sides of a string
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-y-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  }
}
