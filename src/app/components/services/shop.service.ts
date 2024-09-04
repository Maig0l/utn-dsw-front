import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Shop {
  id: number
  name: string
  img: string
  site: string
}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class ShopService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  shopsEndpoint = "http://localhost:8080/api/shops"

  getAllShops(): Observable<Shop[]> {
    return this.http.get<ApiResponse>(this.shopsEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
    }

  addShop(name: string, img: string, site: string): Observable<Shop> {
    return this.http.post<Shop>(this.shopsEndpoint, { name, img, site })
  }

  deleteShop(id: string): Observable<Shop> {
    const url = this.shopsEndpoint + `/${id}`
    return this.http.delete<ApiResponse>(url)
      .pipe(map(res => res.data))
  }
}