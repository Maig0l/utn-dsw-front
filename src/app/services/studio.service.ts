import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Studio } from '../model/studio.model';
import { ApiResponse } from '../model/apiResponse.model';
import { API_URL } from '../../main';

type responseStudioList = ApiResponse<Studio[]>;
type responseStudio = ApiResponse<Studio>;

@Injectable({
  providedIn: 'root',
})
export class StudioService {
  constructor(private http: HttpClient) {}

  studiosEndpoint = `${API_URL}/studios`;

  getAllStudios(): Observable<Studio[]> {
    return this.http
      .get<responseStudioList>(this.studiosEndpoint)
      .pipe(map((response) => response.data));
  }

  getStudiosByName(name: string): Observable<Studio[]> {
    const url = this.studiosEndpoint + `/search?name=${name}`;
    return this.http
      .get<responseStudioList>(url)
      .pipe(map((response) => response.data));
  }

  addStudio(name: string, type: string, site: string): Observable<Studio> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    return this.http
      .post<responseStudio>(
        this.studiosEndpoint,
        { name, type, site },
        { headers },
      )
      .pipe(map((response) => response.data));
  }

  updateStudio(id: number, studioData: Partial<Studio>): Observable<Studio> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    return this.http.put<Studio>(`${this.studiosEndpoint}/${id}`, studioData, {
      headers,
    });
  }

  deleteStudio(id: number): Observable<Studio> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const url = this.studiosEndpoint + `/${id}`;
    return this.http
      .delete<responseStudio>(url, { headers })
      .pipe(map((res) => res.data));
  }
}
