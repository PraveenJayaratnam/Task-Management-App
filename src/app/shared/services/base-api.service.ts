import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  getEntity<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }

  postEntity<T>(url: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, data);
  }

  putEntity<T>(url: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, data);
  }

  deleteEntity<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`);
  }
}
