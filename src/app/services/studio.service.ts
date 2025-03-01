import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Studio } from '../model/studio.model';
import { ApiResponse } from '../model/apiResponse.model';

type responseStudioList = ApiResponse<Studio[]>;
type responseStudio = ApiResponse<Studio>;

@Injectable({
  providedIn: 'root',
})
export class StudioService {
  constructor(private http: HttpClient) {}

  studiosEndpoint = 'http://localhost:8080/api/studios';

  getAllStudios(): Observable<Studio[]> {
    return this.http
      .get<responseStudioList>(this.studiosEndpoint)
      .pipe(map((response) => response.data));
  }

  addStudio(name: string, type: string, site: string): Observable<Studio> {
    return this.http
      .post<responseStudio>(this.studiosEndpoint, { name, type, site })
      .pipe(map((response) => response.data));
  }

  deleteStudio(name: string): Observable<Studio> {
    const url = this.studiosEndpoint + `/${name}`;
    return this.http.delete<responseStudio>(url).pipe(map((res) => res.data));
  }
}
