import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Tag } from '../model/tag.model';
import { ApiResponse } from '../model/apiResponse.model';
import { API_URL } from '../../main';

type responseTag = ApiResponse<Tag>;
type responseTagList = ApiResponse<Tag[]>;

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  tagsEndpoint = `${API_URL}/tags`;

  //REVISAR 100% xq no se si esta bien pasado el nombre
  // la idea es que pasas el nombre del tag y que devuelva un array de tags
  getTagsByName(name: string): Observable<Tag[]> {
    const url = this.tagsEndpoint + `/search?name=${name}`;
    return this.http
      .get<responseTagList>(url)
      .pipe(map((response) => response.data));
  }
  getAllTags(): Observable<Tag[]> {
    return (
      this.http
        .get<responseTagList>(this.tagsEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data))
    );
  }
  getOneTag(id: number): Observable<Tag> {
    const url = this.tagsEndpoint + `/${id}`;
    return this.http
      .get<responseTag>(url)
      .pipe(map((response) => response.data));
  }

  addTag(name: string, description: string): Observable<Tag> {
    return this.http
      .post<responseTag>(this.tagsEndpoint, { name, description })
      .pipe(map((response) => response.data));
  }

  updateTag(id: number, name: string, description: string): Observable<Tag> {
    const url = this.tagsEndpoint + `/${id}`;
    return this.http.put<Tag>(url, { id, name, description });
  }

  deleteTag(id: number): Observable<Tag> {
    const url = this.tagsEndpoint + `/${id}`;
    return this.http.delete<responseTag>(url).pipe(map((res) => res.data));
  }
}
