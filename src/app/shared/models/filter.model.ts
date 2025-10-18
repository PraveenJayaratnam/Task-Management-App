export interface Filter {
  userId?: string;
  searchTerm?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
