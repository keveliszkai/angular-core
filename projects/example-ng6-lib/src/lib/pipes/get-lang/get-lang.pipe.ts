import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../language/services/language.service';
import { TranslatableProperty } from '../../language/models/translatable-property.model';
import { _ } from '../../language/marker';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'getLang',
  pure: false
})
export class GetLangPipe implements PipeTransform {
  constructor(private readonly languageService: LanguageService, private readonly translateService: TranslateService) {}

  /**
   * Gets the translation of the translatable property.
   *
   * @param {TranslatableProperty} The translatable property
   * @returns {string} The property translation according to the current language.
   */
  public transform(translatableProperty: TranslatableProperty): string {
    let value;

    if (translatableProperty) {
      value = translatableProperty.get(this.languageService.currentLang);
    }

    return value && value !== '' ? value : this.translateService.instant(_('content.no-content'));
  }
}
