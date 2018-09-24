export class PaginateObject {
  constructor (
    public itemsPerPage: number,
    public currentPage: number,
    public totalItems: number,
  ) {}
}

