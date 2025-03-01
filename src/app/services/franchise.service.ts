import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Game } from '../model/game.model';
import {Franchise} from "../model/franchise.model";
import {ApiResponse} from "../model/apiResponse.model";

@Injectable()
export class FranchiseService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  franchisesEndpoint = "http://localhost:8080/api/franchises"

  getAllFranchises(): Observable<Franchise[]> {
    return this.http.get<ApiResponse<Franchise[]>>(this.franchisesEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
  }

  addFranchise(name: string, games:Game[]): Observable<Franchise>{
    return this.http.post<Franchise>(this.franchisesEndpoint, { name, games });
  }

  updateFranchise(id: number, name: string, /*games:Game[]*/): Observable<Franchise> {
    const url = this.franchisesEndpoint + `/${id}`
    return this.http.put<Franchise>(url, {id, name, /*games*/ })
  }

  deleteFranchise(id: number): Observable<Franchise> {
    const url = this.franchisesEndpoint + `/${id}`
    return this.http.delete<ApiResponse<Franchise>>(url)
      .pipe(map(res => res.data))
  }

    getOneFranchise(id: number): Observable<Franchise> {
    const url = this.franchisesEndpoint + `/${id}`;
    return this.http.get<ApiResponse<Franchise>>(url)
      .pipe(map(response => response.data));
  }

 }
