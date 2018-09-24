import { PropertyTranslationResponse } from '../interfaces/property-translation.response';
import { PropertyTranslation } from '../models/property-translation.model';
import { FactoryBase } from '../../interfaces';

export class PropertyTranslationFactory implements FactoryBase<PropertyTranslation> {
  public loadFromResponse(response: PropertyTranslationResponse[]): PropertyTranslation[] {
    return response.map(translation => new PropertyTranslation(translation));
  }

  // This function exists, because this is used in a model.
  public static loadFromResponse(response: PropertyTranslationResponse[]): PropertyTranslation[] {
    return response.map(translation => new PropertyTranslation(translation));
  }
}
