import { PaginationRequest } from '../models';

export class QueryHelper {
  static buildPaginationQuery(paginationRequest: PaginationRequest): string {
    const params = new URLSearchParams();

    params.set('pageIndex', paginationRequest.pageIndex.toString());
    params.set('pageSize', paginationRequest.pageSize.toString());

    if (paginationRequest.sortBy) {
      params.set('sortBy', paginationRequest.sortBy);
    }

    if (paginationRequest.sortDirection) {
      params.set('sortDirection', paginationRequest.sortDirection);
    }

    if (paginationRequest.searchTerm) {
      params.set('searchTerm', paginationRequest.searchTerm);
    }

    return params.toString();
  }
}
