import { User } from '../models';

export interface BaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: User;
  updatedBy?: User;
  isActive?: boolean;
  isDeleted?: boolean;
}
