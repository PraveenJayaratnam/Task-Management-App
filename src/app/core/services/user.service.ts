import { Injectable } from '@angular/core';
import { UpdateUserDto, User } from '@core/models';
import { BaseApiService } from '@shared/services';
import { Observable } from 'rxjs';

export interface UserResponse {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService {
  #apiUrl = 'Users';

  getUsers(): Observable<UserResponse[]> {
    return this.getEntity<UserResponse[]>(`${this.#apiUrl}`);
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.getEntity<UserResponse>(`${this.#apiUrl}/${id}`);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<UserResponse> {
    return this.putEntity<UserResponse>(`${this.#apiUrl}/${id}`, updateUserDto);
  }

  deleteUser(id: string): Observable<void> {
    return this.deleteEntity<void>(`${this.#apiUrl}/${id}`);
  }

  mapToUser(response: UserResponse): User {
    return {
      id: response.id,
      username: response.username,
      firstName: response.firstName,
      lastName: response.lastName,
      isActive: response.isActive,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  mapToUpdateDto(user: Partial<User>): UpdateUserDto {
    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    };
  }
}
