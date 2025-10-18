import { Injectable } from '@angular/core';
import { BaseApiService } from '@shared/services';
import { Observable } from 'rxjs';
import { UpdateUserDto, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService {
  #baseUrl = 'users';

  getAll(): Observable<User[]> {
    return this.getEntity<User[]>(this.#baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.getEntity<User>(`${this.#baseUrl}/${id}`);
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<User> {
    return this.putEntity<User>(`${this.#baseUrl}/${id}`, updateUserDto);
  }

  delete(id: string): Observable<void> {
    return this.deleteEntity<void>(`${this.#baseUrl}/${id}`);
  }
}
