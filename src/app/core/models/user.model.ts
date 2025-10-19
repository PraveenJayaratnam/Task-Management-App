import { BaseEntity } from './base.model';

export interface User extends BaseEntity {
  username: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  success: boolean;
  message?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
