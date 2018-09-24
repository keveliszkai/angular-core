import { MetaResponse } from './meta-response.interface';

/**
 * The basic response, that came from the backend transformer.
 */
export interface BaseResponse<T> {
  /**
   * Data, object or array, that comes from the backend.
   */
  data: T | T[];

  /**
   * Meta object, that comes from the backend. Example usage: Notifications, pagination object, etc.
   */
  meta: MetaResponse;
}
