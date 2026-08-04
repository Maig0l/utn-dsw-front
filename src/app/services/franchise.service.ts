import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
//import { Game } from '../model/game.model';
import { Franchise } from '../model/franchise.model';
import { ApiResponse } from '../model/apiResponse.model';
import { API_URL } from '../../main.js';

@Injectable({
  providedIn: 'root',
})
export class FranchiseService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  franchisesEndpoint = `${API_URL}/franchises`;

  getAllFranchises(): Observable<Franchise[]> {
    return (
      this.http
        .get<ApiResponse<Franchise[]>>(this.franchisesEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data))
    );
  }

  getOneFranchise(id: number): Observable<Franchise> {
    const url = this.franchisesEndpoint + `/${id}`;
    return this.http
      .get<ApiResponse<Franchise>>(url)
      .pipe(map((response) => response.data));
  }

  getFranchisesByName(name: string): Observable<Franchise[]> {
    const url = this.franchisesEndpoint + `/search?name=${name}`;
    return this.http
      .get<ApiResponse<Franchise[]>>(url)
      .pipe(map((response) => response.data));
  }

  addFranchise(name: string, games: number[]): Observable<Franchise> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    return this.http
      .post<ApiResponse<Franchise>>(
        this.franchisesEndpoint,
        { name, games },
        { headers },
      )
      .pipe(map((response) => response.data));
  }

  updateFranchise(
    id: number,
    name: string,
    games: number[],
  ): Observable<Franchise> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const url = this.franchisesEndpoint + `/${id}`;
    return this.http
      .put<ApiResponse<Franchise>>(url, { id, name, games }, { headers })
      .pipe(map((response) => response.data));
  }

  deleteFranchise(id: number): Observable<Franchise> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const url = this.franchisesEndpoint + `/${id}`;
    return this.http
      .delete<ApiResponse<Franchise>>(url, { headers })
      .pipe(map((res) => res.data));
  }

  linkGame(franchiseId: number, gameId: number): Observable<unknown> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const url = this.franchisesEndpoint + `/${franchiseId}/games`;
    return this.http
      .post<ApiResponse<unknown>>(url, { gameId }, { headers })
      .pipe(map((res) => res.data));
  }

  unlinkGame(franchiseId: number, gameId: number): Observable<unknown> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    const url = this.franchisesEndpoint + `/${franchiseId}/games/${gameId}`;
    return this.http
      .delete<ApiResponse<unknown>>(url, { headers })
      .pipe(map((res) => res.data));
  }
}
