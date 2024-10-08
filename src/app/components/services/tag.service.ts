import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Tag {
  id: number
  name: string
  description: string
}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class TagService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  tagsEndpoint = "http://localhost:8080/api/tags"

  getAllTags(): Observable<Tag[]> {
    return this.http.get<ApiResponse>(this.tagsEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
  }

  addTag(name: string,  description: string): Observable<Tag>{
    return this.http.post<Tag>(this.tagsEndpoint, { name,  description });
  }

  updateTag(id: number, name: string,  description: string): Observable<Tag> {
    const url = this.tagsEndpoint + `/${id}`
    return this.http.put<Tag>(url, {id, name,  description })
  }

  deleteTag(id: number): Observable<Tag> {
    const url = this.tagsEndpoint + `/${id}`
    return this.http.delete<ApiResponse>(url)
      .pipe(map(res => res.data))
  }
}