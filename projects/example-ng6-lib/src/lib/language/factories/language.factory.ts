import { Language } from '../models/language.model';
import { LanguageResponse } from '../interfaces/language.response';
import { FactoryBase } from '../../interfaces';

export class LanguageFactory implements FactoryBase<Language> {
  public loadFromResponse(response: LanguageResponse): Language {
    return new Language(response);
  }
}
