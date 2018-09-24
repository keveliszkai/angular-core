import { PropertyTranslationResponse } from '../interfaces/property-translation.response';

/**
 * This model represents one translatable property's values.
 */
export class PropertyTranslation {
  public locale: string;
  public value: string;

  constructor(response?: PropertyTranslationResponse) {
    if (response) {
      this.locale = response.locale;
      this.value = response.value;
    }
  }
}
