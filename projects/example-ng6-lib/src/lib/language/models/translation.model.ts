import { TranslationResponse } from '../interfaces/translation.response';

export class Translation {
  public key: string;
  public value: string;
  public locale: string;

  constructor(response?: TranslationResponse) {
    if (response) {
      this.key = response.key;
      this.value = response.value;
      this.locale = response.locale;
    }
  }
}
