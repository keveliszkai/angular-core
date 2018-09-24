import { HttpParams } from '@angular/common/http';

export class ObjectUtils {
  /**
   * SubFunction of the objectToParams().
   * @param ob The input object.
   * @param postOrPut POST or PUT request. Boolean variable (optional).
   */
  public static flattenObject(ob, postOrPut = false) {
    let toReturn = {};

    for (const i in ob) {
      if (!ob.hasOwnProperty(i)) {
        continue;
      }

      if (typeof ob[i] === 'object') {
        const flatObject = this.flattenObject(ob[i], postOrPut);
        toReturn = this.handleFlatObject(i, flatObject, toReturn, postOrPut);
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  public static handleFlatObject(namespace: string, flatObject: object, toReturn: object, postOrPut: boolean) {
    for (const x in flatObject) {
      if (!flatObject.hasOwnProperty(x)) {
        continue;
      }

      if (postOrPut) {
        toReturn[namespace + '.' + x] = flatObject[x];
      } else {
        toReturn[namespace + '[' + x + ']'] = flatObject[x];
      }
    }

    return toReturn;
  }

  /**
   * This function can transform the deep objects to linear query. For example it does from `data.firstLevel.second` property to
   * `data[firstLevel][second]`. It can be used in the get query strings.
   * @param input The input object. Can be any type of object.
   * @param postOrPut POST or PUT request. Boolean variable (optional).
   */
  public static objectToParams(input: Object, postOrPut = false): HttpParams {
    let params = new HttpParams();

    const newObject = this.flattenObject(input, postOrPut);

    for (const key in newObject) {
      if (newObject.hasOwnProperty(key) && newObject[key]) {
        params = params.set(key, newObject[key]);
      }
    }

    return params;
  }
}
