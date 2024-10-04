import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Franchise {
  id: number
  //TODO , name, games[]
}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class FranchiseService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  franchisesEndpoint = "http://localhost:8080/api/franchises"

  getAllFranchises(): Observable<Franchise[]> {
    return this.http.get<ApiResponse>(this.franchisesEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
  }

  /*
  addFranchise(TODO): Observable<Franchise>{
    return this.http.post<Franchise>(this.franchisesEndpoint, { TODO });
  }

  updateFranchise(TODO): Observable<Franchise> {
    const url = this.franchisesEndpoint + `/${id}`
    return this.http.put<Franchise>(url, {TODO })
  }
*/
  deleteFranchise(id: number): Observable<Franchise> {
    const url = this.franchisesEndpoint + `/${id}`
    return this.http.delete<ApiResponse>(url)
      .pipe(map(res => res.data))
  }
  
 }
