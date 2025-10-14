import { Injectable } from '@angular/core';
import { Task } from '@features/task-management/models';
import { DataResponse, PaginationRequest } from '@shared/models';
import { BaseApiService } from '@shared/services';
import { QueryHelper } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService extends BaseApiService {
  #baseUrl = 'tasks';

  getAll(): Observable<Task[]> {
    return this.get<Task[]>(`${this.#baseUrl}/get-all`);
  }

  getList(paginationRequest: PaginationRequest): Observable<DataResponse<Task>> {
    const params = QueryHelper.buildPaginationQuery(paginationRequest);
    return this.get<DataResponse<Task>>(`${this.#baseUrl}/list?${params}`);
  }

  create(task: Task): Observable<Task> {
    return this.post<Task>(`${this.#baseUrl}/create`, task);
  }

  update(id: number, task: Task): Observable<Task> {
    return this.put<Task>(`${this.#baseUrl}/update/${id}`, task);
  }

  remove(id: string): Observable<Task> {
    return this.delete<Task>(`${this.#baseUrl}/delete/${id}`);
  }
}
