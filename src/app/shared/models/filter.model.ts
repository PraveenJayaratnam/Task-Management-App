export interface Filter<T = unknown> {
  userId?: string;
  status?: T;
  searchTerm?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
