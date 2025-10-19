import { User } from '../models';

export interface BaseEntity {
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: User;
  updatedBy?: User;
  isActive?: boolean;
  isDeleted?: boolean;
}
