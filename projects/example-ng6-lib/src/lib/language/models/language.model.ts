import { LanguageResponse } from '../interfaces/language.response';

export class Language {
  public id: number;
  public name: string;
  public locale: string;
  public slug: string;
  public status: boolean;
  public default: boolean;

  constructor(response?: LanguageResponse) {
    this.status = (response && !!response.active) || false;
    this.default = (response && !!response.default) || false;

    if (response) {
      this.id = response.id;
      this.slug = response.slug;
      this.name = response.name;
      this.locale = response.locale;
    }
  }
}
