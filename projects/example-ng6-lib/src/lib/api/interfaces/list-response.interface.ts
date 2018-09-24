import { BaseResponse } from './base-response.interface';

export interface ListResponse<T> extends BaseResponse<T> {
  /**
   * The list response, that comes for the index requests by the backend response transformer.
   */
  data: T[];
}
