import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Shop } from '../model/shop.model';
import { ApiResponse } from '../model/apiResponse.model';
import { API_URL } from '../../main.js';

// Forma en la que el backend representa un Shop (entidad Shop.java)
interface ShopDTO {
  id: number;
  name: string;
  icon?: string;
  siteUrl?: string;
}

type resShopArray = ApiResponse<ShopDTO[]>;
type resShopSingle = ApiResponse<ShopDTO>;

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) { }

  shopsEndpoint = `${API_URL}/shops`

  private mapShop(dto: ShopDTO): Shop {
    return { id: dto.id, name: dto.name, img: dto.icon ?? '', site: dto.siteUrl ?? '' };
  }

  getAllShops(): Observable<Shop[]> {
    return (
      this.http
        .get<resShopArray>(this.shopsEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data.map((dto) => this.mapShop(dto))))
    );
  }

  getShopsByName(name: string): Observable<Shop[]> {
    const url = this.shopsEndpoint + `/search?name=${name}`;
    return this.http
      .get<resShopArray>(url)
      .pipe(map((response) => response.data.map((dto) => this.mapShop(dto))));
  }

  addShop(name: string, site: string): Observable<Shop> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    return this.http
      .post<resShopSingle>(
        this.shopsEndpoint,
        { name, siteUrl: site },
        { headers },
      )
      .pipe(map((res) => this.mapShop(res.data)));
  }

  updateShop(id: number, shopData: Partial<Shop>): Observable<Shop> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const body: Partial<ShopDTO> = { name: shopData.name };
    if (shopData.img !== undefined) body.icon = shopData.img;
    if (shopData.site !== undefined) body.siteUrl = shopData.site;

    return this.http
      .put<resShopSingle>(`${this.shopsEndpoint}/${id}`, body, { headers })
      .pipe(map((res) => this.mapShop(res.data)));
  }

  deleteShop(id: number): Observable<Shop> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const url = this.shopsEndpoint + `/${id}`;
    return this.http
      .delete<resShopSingle>(url, { headers })
      .pipe(map((res) => this.mapShop(res.data)));
  }
}
