import { BaseResponse } from './base-response.interface';

/**
 * The response, that comes for the edit requests by the backend response transformer.
 */
export interface EditResponse<T> extends BaseResponse<T> {
  /**
   * The object, that comes from the backend.
   */
  data: T;
}
