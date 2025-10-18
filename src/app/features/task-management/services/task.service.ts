import { Injectable } from '@angular/core';
import {
  CreateTask,
  Task,
  TaskStatus,
  UpdateTask,
} from '@features/task-management/models';
import { DataResponse, Filter } from '@shared/models';
import { BaseApiService } from '@shared/services';
import { QueryHelper } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService extends BaseApiService {
  #baseUrl = 'tasks';

  getAll(): Observable<Task[]> {
    return this.getEntity<Task[]>(this.#baseUrl);
  }

  getList(filter?: Filter<TaskStatus>): Observable<DataResponse<Task>> {
    const queryString = QueryHelper.buildQuery(filter);
    const url = queryString ? `${this.#baseUrl}?${queryString}` : this.#baseUrl;
    return this.getEntity<DataResponse<Task>>(url);
  }

  getById(id: string): Observable<Task> {
    return this.getEntity<Task>(`${this.#baseUrl}/${id}`);
  }

  create(createTask: CreateTask): Observable<Task> {
    return this.postEntity<Task>(this.#baseUrl, createTask);
  }

  update(id: string, updateTask: UpdateTask): Observable<Task> {
    return this.putEntity<Task>(`${this.#baseUrl}/${id}`, updateTask);
  }

  delete(id: string): Observable<void> {
    return this.deleteEntity<void>(`${this.#baseUrl}/${id}`);
  }

  remove(id: string): Observable<void> {
    return this.deleteEntity<void>(`${this.#baseUrl}/${id}`);
  }

  getTasksByUser(userId: string): Observable<Task[]> {
    return this.getEntity<Task[]>(`${this.#baseUrl}/user/${userId}`);
  }
}
