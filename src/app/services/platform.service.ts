import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Platform } from '../model/platform.model';
import { ApiResponse } from '../model/apiResponse.model';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(private http: HttpClient) {}

  // Usar la URL del environment en lugar de hardcodear
  platformsEndpoint = `${environment.apiUrl}/api/platforms`;

  getOnePlatform(id: number): Observable<Platform> {
    const url = this.platformsEndpoint + `/${id}`;
    return this.http
      .get<ApiResponse<Platform>>(url)
      .pipe(map((response) => response.data));
  }

  getPlatformsByName(name: string): Observable<Platform[]> {
    const url = this.platformsEndpoint + `/search?name=${name}`;
    return this.http
      .get<ApiResponse<Platform[]>>(url)
      .pipe(map((response) => response.data));
  }

  getAllPlatforms(): Observable<Platform[]> {
    return (
      this.http
        .get<ApiResponse<Platform[]>>(this.platformsEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data))
    );
  }

  addPlatform(name: string, img?: string): Observable<Platform> {
    const payload: { name: string; img?: string } = { name };
    if (img && img.trim() !== '') {
      payload.img = img;
    }

    return this.http
      .post<ApiResponse<Platform>>(this.platformsEndpoint, payload)
      .pipe(map((response) => response.data));
  }

  updatePlatform(id: number, name: string, img: string): Observable<Platform> {
    const url = this.platformsEndpoint + `/${id}`;
    return this.http.put<Platform>(url, { id, name, img });
  }

  deletePlatform(id: number): Observable<Platform> {
    const url = this.platformsEndpoint + `/${id}`;
    return this.http
      .delete<ApiResponse<Platform>>(url)
      .pipe(map((res) => res.data));
  }

  uploadImage(
    platformId: number,
    file: File,
  ): Observable<{ message: string; img: string }> {
    const formData = new FormData();
    formData.append('img', file);

    return this.http.patch<{ message: string; img: string }>(
      `${this.platformsEndpoint}/${platformId}/upload`,
      formData,
    );
  }
}
