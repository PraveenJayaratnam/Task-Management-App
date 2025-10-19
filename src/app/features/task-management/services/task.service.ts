import { Injectable } from '@angular/core';
import {
  CreateTask,
  Task,
  TaskFilter,
  UpdateTask,
} from '@features/task-management/models';
import { DataResponse } from '@shared/models';
import { BaseApiService } from '@shared/services';
import { QueryHelper } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService extends BaseApiService {
  #baseUrl = 'tasks';

  getAll(): Observable<Task[]> {
    return this.getEntity<Task[]>(`${this.#baseUrl}/queryable`);
  }

  getAllQueryable(filter?: TaskFilter): Observable<Task[]> {
    const queryString = QueryHelper.buildQuery(filter);
    const url = queryString ? `${this.#baseUrl}/queryable?${queryString}` : `${this.#baseUrl}/queryable`;
    return this.getEntity<Task[]>(url);
  }

  getList(filter?: TaskFilter): Observable<DataResponse<Task>> {
    const queryString = QueryHelper.buildQuery(filter);
    const url = queryString ? `${this.#baseUrl}/paginated?${queryString}` : `${this.#baseUrl}/paginated`;
    return this.getEntity<DataResponse<Task>>(url);
  }

  getFilteredQueryable(filter?: TaskFilter): Observable<Task[]> {
    const queryString = QueryHelper.buildQuery(filter);
    const url = queryString ? `${this.#baseUrl}/queryable?${queryString}` : `${this.#baseUrl}/queryable`;
    return this.getEntity<Task[]>(url);
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
    return this.getEntity<Task[]>(`${this.#baseUrl}/queryable?userId=${userId}`);
  }
}
