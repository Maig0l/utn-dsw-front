import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Game {
  id: number,
  title: string,
  synopsis: string,
  releaseDate: string,
  portrait: string,
  banner: string,
  franchise: number

}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class GameService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  gamesEndpoint = "http://localhost:8080/api/games"

  getAllGames(): Observable<Game[]> {
    return this.http.get<ApiResponse>(this.gamesEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
  }

  
  addGame(title: string, synopsis: string, releaseDate: string, portrait: string, banner: string, pictures: string, franchise: number): Observable<Game>{
    return this.http.post<Game>(this.gamesEndpoint, { title, synopsis, releaseDate, portrait, banner, pictures, franchise });
  }

 /* updateGame(TODO): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`
    return this.http.put<Game>(url, {TODO })
  }
*/
  deleteGame(id: number): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`
    return this.http.delete<ApiResponse>(url)
      .pipe(map(res => res.data))
  }
  
 }
