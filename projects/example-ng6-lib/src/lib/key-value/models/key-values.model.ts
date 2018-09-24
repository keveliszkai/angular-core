import { KeyValue } from '../../interfaces';

export class KeyValues {
  [key: string]: string;

  /**
   * This function makes a KeyValues model from key-value array.
   *
   * @static
   * @param {KeyValue[]} keyValueArray
   * @returns {KeyValues}
   * @memberof KeyValues
   */
  public static fromArray(keyValueArray: KeyValue[]): KeyValues {
    const keyValues: KeyValues = new KeyValues();
    keyValueArray.forEach(kv => (keyValues[kv.key] = kv.value));
    return keyValues;
  }

  /**
   * This function makes a key-value array from KeyValues model.
   *
   * @static
   * @param {KeyValues} keyValues
   * @returns {KeyValue[]}
   * @memberof KeyValues
   */
  public static toArray(keyValues: KeyValues): KeyValue[] {
    const keyValueArray: KeyValue[] = [];
    Object.keys(keyValues).forEach(key => {
      keyValueArray.push({ key: key, value: keyValues[key] });
    });
    return keyValueArray;
  }
}
