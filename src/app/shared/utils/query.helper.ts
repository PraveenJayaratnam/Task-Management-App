import { Filter } from '@shared/models';

export class QueryHelper {
  static buildQuery(filter?: Filter): string {
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

  static buildPaginationQuery(paginationRequest: Filter): string {
    return this.buildQuery(paginationRequest);
  }
}
