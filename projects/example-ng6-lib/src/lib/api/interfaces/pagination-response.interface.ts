/**
 * Pagination object for the list views.
 */
export interface PaginationResponse {
  /**
   * Count of something.
   */
  count: number;

  /**
   * Current page index. First page is 1.
   */
  current_page: number;

  /**
   * Out of usage.
   */
  links: string[];

  /**
   * Number of items per page.
   */
  per_page: number;

  /**
   * Total number of items.
   */
  total: number;

  /**
   * Total number of pages.
   */
  total_pages: number;
}
