/**
 * The frontend object, that represents the list object.
 */
export class ListObject<T> {
  /**
   *
   * @param data Object array/list, that contains the data itself.
   * @param count The number of all items, that available in the backend.
   */
  constructor(public data: T[], public count: number) {}
}
