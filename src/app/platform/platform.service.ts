import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Platform {
  id: number
  name: string
  img: string
}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class PlatformService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  platformsEndpoint = "http://localhost:8080/api/platforms"

  getAllPlatforms(): Observable<Platform[]> {
    return this.http.get<ApiResponse>(this.platformsEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
  }

  addPlatform(platform: Platform): Observable<Platform> {
    return this.http.post<ApiResponse>(this.platformsEndpoint, platform)
      .pipe(map(response => response.data))
  }
}