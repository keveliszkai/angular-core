import { PropertyTranslation } from './property-translation.model';
import { PropertyTranslationFactory } from '../factories/property-translation.factory';
import { PropertyTranslationResponse } from '../interfaces/property-translation.response';
import { PropertyTranslationRequest } from '../interfaces/property-translation.request';

export class TranslatableProperty {
  /**
   * Default language
   *
   * @memberof TranslatableProperty
   */
  public readonly defaultLanguage = 'en';

  /**
   * Current translations.
   *
   * @private
   * @type {PropertyTranslation[]}
   * @memberof TranslatableProperty
   */
  private translations: PropertyTranslation[] = [];

  /**
   * Gets the translation according to the default language. First, it that does not exists.
   *
   * @readonly
   * @type {string}
   * @memberof TranslatableProperty
   */
  public get default(): string {
    return this.translations.find(i => i.locale === this.defaultLanguage)
      ? this.translations.find(i => i.locale === this.defaultLanguage).value
      : this.translations[0].value;
  }

  /**
   * Gets the translation by locale.
   *
   * @param {string} locale
   * @returns {(string | undefined)}
   * @memberof TranslatableProperty
   */
  public get(locale: string): string | undefined {
    const element = this.translations.find(translation => translation.locale === locale);
    return element ? element.value : undefined;
  }

  /**
   * Sets a translation.
   *
   * @param {string} locale
   * @param {string} value
   * @memberof TranslatableProperty
   */
  public set(locale: string, value: string): void {
    const element = this.translations.find(translation => translation.locale === locale);
    if (element) {
      element.value = value;
    } else {
      this.translations.push({ locale: locale, value: value });
    }
  }

  /**
   * Get the values in all languages.
   *
   * @returns {PropertyTranslation[]}
   * @memberof TranslatableProperty
   */
  public getAll(): PropertyTranslation[] {
    return this.translations;
  }

  /**
   * Fills the x-form-data, with the giwen namespace. This returns the new FormData!
   *
   * @param {string} namespace
   * @param {FormData} formData
   * @returns {FormData}
   * @memberof TranslatableProperty
   */
  public fillFormData(namespace: string, formData: FormData): FormData {
    this.translations.forEach((translation, index) => {
      if (translation /*&& translation.value*/) {
        const key = `${namespace}[${index}]`;
        formData.append(`${key}[locale]`, translation.locale);
        formData.append(`${key}[value]`, translation.value || '');
      }
    });

    return formData;
  }

  /**
   * Loads the translations from response.
   *
   * @param {(PropertyTranslationResponse[] | string)} response
   * @memberof TranslatableProperty
   */
  public loadTranslations(response: PropertyTranslationResponse[] | string): void {
    if (response) {
      if (response instanceof Array) {
        this.translations = PropertyTranslationFactory.loadFromResponse(response);
      } else {
        this.translations = [
          new PropertyTranslation({
            locale: this.defaultLanguage,
            value: response
          })
        ];
      }
    }
  }

  /**
   * Generates the request.
   *
   * @returns {PropertyTranslationRequest[]}
   * @memberof TranslatableProperty
   */
  public toRequest(): PropertyTranslationRequest[] {
    return this.translations.filter(i => i && i.value).map(translation => {
      return { locale: translation.locale, value: translation.value };
    });
  }
}
