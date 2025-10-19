import { PaginationRequest } from '../models';

export interface Filter extends PaginationRequest {
  userId?: string;
}
