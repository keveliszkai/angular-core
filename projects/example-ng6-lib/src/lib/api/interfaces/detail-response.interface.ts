import { BaseResponse } from './base-response.interface';

/**
 * The response, that comes for the show requests by the backend response transformer.
 */
export interface DetailResponse<T> extends BaseResponse<T> {
  /**
   * The object, that comes from the backend.
   */
  data: T;
}
