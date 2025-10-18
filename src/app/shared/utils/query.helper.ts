import { Filter } from '@shared/models';

export class QueryHelper {
  static buildQuery<T>(filter?: Filter<T>): string {
    if (!filter) {
      return '';
    }

    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    return params.toString();
  }

  static buildPaginationQuery<T>(paginationRequest: Filter<T>): string {
    return this.buildQuery(paginationRequest);
  }
}
