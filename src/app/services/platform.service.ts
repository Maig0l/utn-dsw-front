import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Platform} from "../model/platform.model";
import {ApiResponse} from "../model/apiResponse.model";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  platformsEndpoint = "http://localhost:8080/api/platforms"

  getAllPlatforms(): Observable<Platform[]> {
    return this.http.get<ApiResponse<Platform[]>>(this.platformsEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
  }

  addPlatform(name: string, img: string): Observable<Platform>{
    return this.http.post<Platform>(this.platformsEndpoint, { name, img });
  }

  updatePlatform(id: number, name: string, img: string): Observable<Platform> {
    const url = this.platformsEndpoint + `/${id}`
    return this.http.put<Platform>(url, {id, name, img })
  }

  deletePlatform(id: number): Observable<Platform> {
    const url = this.platformsEndpoint + `/${id}`
    return this.http.delete<ApiResponse<Platform>>(url)
      .pipe(map(res => res.data))
  }


  getOnePlatform(id: number): Observable<Platform> {
    const url = this.platformsEndpoint + `/${id}`;
    return this.http.get<ApiResponse<Platform>>(url)
      .pipe(map(response => response.data));
  }


}
