import { PaginationResponse } from './pagination-response.interface';
import { NotificationResponse } from '../../notification/interfaces/notification-response.interface';

/**
 * Meta response object.
 */
export interface MetaResponse {
  /**
   * Pagination object. It is nullable.
   */
  pagination?: PaginationResponse;

  /**
   * Pagination object. It is nullable.
   */
  notifications?: NotificationResponse[];
}
