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
  #apiUrl = 'Tasks';

  getAll(): Observable<Task[]> {
    return this.getEntity<Task[]>(`${this.#apiUrl}/all`);
  }

  getList(filter?: TaskFilter): Observable<DataResponse<Task>> {
    const queryString = QueryHelper.buildQuery(filter);
    const url = queryString
      ? `${this.#apiUrl}/paginated?${queryString}`
      : `${this.#apiUrl}/paginated`;
    return this.getEntity<DataResponse<Task>>(url);
  }

  getById(id: string): Observable<Task> {
    return this.getEntity<Task>(`${this.#apiUrl}/${id}`);
  }

  create(createTask: CreateTask): Observable<Task> {
    return this.postEntity<Task>(this.#apiUrl, createTask);
  }

  update(id: string, updateTask: UpdateTask): Observable<Task> {
    return this.putEntity<Task>(`${this.#apiUrl}/${id}`, updateTask);
  }

  delete(id: string): Observable<void> {
    return this.deleteEntity<void>(`${this.#apiUrl}/${id}`);
  }
}
