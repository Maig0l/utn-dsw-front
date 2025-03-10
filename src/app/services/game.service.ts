import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/apiResponse.model';
import { Game } from '../model/game.model';
import { API_URL } from '../../main';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  gamesEndpoint = `${API_URL}/games`;

  getOneGame(id: number): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`;
    return this.http
      .get<ApiResponse<Game>>(url)
      .pipe(map((response) => response.data));
  }

  getAllGames(): Observable<Game[]> {
    return (
      this.http
        .get<ApiResponse<Game[]>>(this.gamesEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data))
    );
  }

  addGame(
    title: string,
    synopsis: string,
    releaseDate: string,
    portrait: string,
    banner: string,
    franchise: number,
    tags: number[],
    studios: number[],
    shops: number[],
    platforms: number[],
  ): Observable<Game> {
    return this.http.post<Game>(this.gamesEndpoint, {
      title,
      synopsis,
      releaseDate,
      portrait,
      banner,
      franchise,
      tags,
      studios,
      shops,
      platforms,
    });
  }

  updateGame(
    id: number,
    title: string,
    synopsis: string,
    releaseDate: string,
    portrait: string,
    banner: string,
    franchise: number,
    tags: number[],
    studios: number[],
    shops: number[],
    platforms: number[],
  ): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`;
    return this.http.patch<Game>(url, {
      id,
      title,
      synopsis,
      releaseDate,
      portrait,
      banner,
      franchise,
      tags,
      studios,
      shops,
      platforms,
    });
  }

  deleteGame(id: number): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`;
    return this.http
      .delete<ApiResponse<Game>>(url)
      .pipe(map((res) => res.data));
  }

  addPicturesToGame(game_id: number, urls: string[]): Observable<string[]> {
    const url = 'http://localhost:8080/api/game-picture';
    return this.http.post<string[]>(url, { game_id, urls });
  }
  findGamesByTitle(title: string): Observable<Game[]> {
    const url = this.gamesEndpoint + `/search?title=${title}`;
    return this.http
      .get<ApiResponse<Game[]>>(url)
      .pipe(map((response) => response.data));
  }

  /** Retrieves most recently reviews games
   * TODO: Implement 'hotness' (which games are retrieved) in backend
   * For now, just get all games and return 3 or 4
   */
  getHotGames() {
    return this.http.get<ApiResponse<Game[]>>(this.gamesEndpoint).pipe(
      map((res) => {
        return res.data.slice(0, 5);
      }),
    );
  }
  /*
    addTagsToGame(id: number, tags: number): Observable<Game> {
      const url = this.gamesEndpoint + `/${id}`;
      return this.http.patch<Game>(url, { tags });
    }
  
    addStudiosToGame(id: number, studios: number): Observable<Game> {
      const url = this.gamesEndpoint + `/${id}`;
      return this.http.patch<Game>(url, { studios });
    }
  
    addShopsToGame(id: number, shops: number): Observable<Game> {
      const url = this.gamesEndpoint + `/${id}`;
      return this.http.patch<Game>(url, { shops });
    }
  
    addPlatformsToGame(id: number, platforms: number): Observable<Game> {
      const url = this.gamesEndpoint + `/${id}`;
      return this.http.patch<Game>(url, { platforms });
    }
  */
}
