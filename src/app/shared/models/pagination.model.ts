export interface DataResponse<T> {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationRequest {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}
