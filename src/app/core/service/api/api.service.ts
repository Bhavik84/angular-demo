/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(URL: string, params?: string): Observable<any> {
    return this.http.get<any>(
      `${environment.API_END_POINT + URL}` + (params ? `?${params}` : ''),
    );
  }

  post(URL: string, data: any): Observable<any> {
    return this.http.post<any>(environment.API_END_POINT + URL, data);
  }

  put<T>(URL: string, data: T): Observable<T> {
    return this.http.put<T>(environment.API_END_POINT + URL, data);
  }

  patch<T>(URL: string, data: T): Observable<T> {
    return this.http.patch<T>(environment.API_END_POINT + URL, data);
  }
}
