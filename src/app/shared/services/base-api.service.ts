import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }

  post<T>(url: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, data);
  }

  put<T>(url: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, data);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`);
  }
}
