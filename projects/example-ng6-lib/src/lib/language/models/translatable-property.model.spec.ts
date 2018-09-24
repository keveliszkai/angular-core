/* tslint:disable *//* tslint:disable */
import { TranslatableProperty } from './translatable-property.model';

class TestClass {
  public id = 0;
  public name: TranslatableProperty = new TranslatableProperty();
  public displayName = '';
}

describe('Model: TranslatableProperty', () => {
  let model: TestClass;

  beforeEach(() => {
    model = new TestClass();
  });

  it('should load translations from response', () => {
    model.name.loadTranslations([{ locale: 'en', value: 'name EN' }, { locale: 'hu', value: 'name HU' }]);

    expect(model.name.getAll().length).toEqual(2);
    expect(model.name.getAll()[0].locale).toEqual('en');
    expect(model.name.getAll()[0].value).toEqual('name EN');
    expect(model.name.getAll()[1].locale).toEqual('hu');
    expect(model.name.getAll()[1].value).toEqual('name HU');
  });

  it('should get one property', () => {
    model.name.loadTranslations([{ locale: 'en', value: 'name EN' }, { locale: 'hu', value: 'name HU' }]);

    expect(model.name.get('hu')).toEqual('name HU');
    expect(model.name.get('en')).toEqual('name EN');
  });

  it('should returns the default property', () => {
    model.name.loadTranslations([{ locale: 'en', value: 'name EN' }, { locale: 'hu', value: 'name HU' }]);

    expect(model.name.default).toEqual('name EN');
  });

  it('should set one property', () => {
    const expectation = 'SomeString';
    model.name.loadTranslations([{ locale: 'en', value: 'name EN' }, { locale: 'hu', value: 'name HU' }]);

    expect(model.name.get('hu')).toEqual('name HU');

    model.name.set('hu', expectation);
    expect(model.name.get('hu')).toEqual(expectation);
  });

  it('should fill an existing FormData', () => {
    const expectation = new FormData();
    expectation.append('name[0][locale]', 'en');
    expectation.append('name[0][value]', 'name EN');
    expectation.append('name[1][locale]', 'hu');
    expectation.append('name[1][value]', 'name HU');

    model.name.loadTranslations([{ locale: 'en', value: 'name EN' }, { locale: 'hu', value: 'name HU' }]);

    let result = new FormData();

    result = model.name.fillFormData('name', result);

    expect(result).toEqual(expectation);
  });

  it('should fill an existing FormData with another namespace', () => {
    const expectation = new FormData();
    expectation.append('namespace[0][locale]', 'en');
    expectation.append('namespace[0][value]', 'name EN');
    expectation.append('namespace[1][locale]', 'hu');
    expectation.append('namespace[1][value]', 'name HU');

    model.name.loadTranslations([{ locale: 'en', value: 'name EN' }, { locale: 'hu', value: 'name HU' }]);

    let result = new FormData();

    result = model.name.fillFormData('namespace', result);

    expect(result).toEqual(expectation);
  });
});
