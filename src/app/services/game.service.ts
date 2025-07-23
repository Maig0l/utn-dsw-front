import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  findGamesByTitle(title: string): Observable<Game[]> {
    const url = this.gamesEndpoint + `/search?title=${title}`;
    return this.http
      .get<ApiResponse<Game[]>>(url)
      .pipe(map((response) => response.data));
  }

  // TODO: Cambiar firmas de las siguientes funciones para que tomen objetos Game en el parámetro
  filterGames(
    tags: number[],
    platform: number[],
    studio: number[],
    franchise: number[],
    startDate: Date,
    endDate: Date,
    minStarValue: number,
    maxStarValue: number,
  ): Observable<Game[]> {
    const url = this.gamesEndpoint + `/filter`;
    if (endDate.getTime() === new Date('1970-01-01T03:00:00.000Z').getTime()) {
      endDate = new Date(2030, 0, 1);
    }

    // Construct query parameters
    const params = new HttpParams()
      .set('tags', tags.join(',')) // Convert array to comma-separated string
      .set('platform', platform.join(','))
      .set('studio', studio.join(','))
      .set('franchise', franchise.join(','))
      .set('startDate', startDate.toISOString()) // Convert Date to ISO string
      .set('endDate', endDate.toISOString())
      .set('minStarValue', minStarValue.toString())
      .set('maxStarValue', maxStarValue.toString());
    return this.http
      .get<ApiResponse<Game[]>>(url, { params })
      .pipe(map((response) => response.data));
  }

  addGameObj(game: Game): Observable<Game> {
    return this.http.post<Game>(this.gamesEndpoint, game);
  }

  /*
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
      franchise != 0 ? franchise : null,
      tags,
      studios,
      shops,
      platforms,
    });
  }
*/

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

  /** Retrieves most recently reviews games, prioritizing games with user's liked tags
   * TODO: Implement 'hotness' (which games are retrieved) in backend
   * For now, get all games and filter/sort by user preferences
   */
  getHotGames(userLikedTagIds?: number[]) {
    return this.http.get<ApiResponse<Game[]>>(this.gamesEndpoint).pipe(
      map((res) => {
        let games = res.data;

        if (userLikedTagIds && userLikedTagIds.length > 0) {
          // Separar juegos que tienen tags que le gustan al usuario
          const gamesWithLikedTags = games.filter((game) =>
            game.tags?.some((tag) => userLikedTagIds.includes(tag.id)),
          );

          // Separar juegos que NO tienen tags que le gustan al usuario
          const gamesWithoutLikedTags = games.filter(
            (game) =>
              !game.tags?.some((tag) => userLikedTagIds.includes(tag.id)),
          );

          // Combinar: primero los que tienen tags que le gustan, después los demás
          games = [...gamesWithLikedTags, ...gamesWithoutLikedTags];
        }

        return games.slice(0, 6);
      }),
    );
  }

  uploadPortrait(
    gameId: number,
    file: File,
  ): Observable<{ message: string; portrait: string }> {
    const formData = new FormData();
    formData.append('portrait', file);
    return this.http.patch<{ message: string; portrait: string }>(
      `${this.gamesEndpoint}/${gameId}/uploads/portrait`,
      formData,
    );
  }

  uploadBanner(
    gameId: number,
    file: File,
  ): Observable<{ message: string; banner: string }> {
    const formData = new FormData();
    formData.append('banner', file);
    return this.http.patch<{ message: string; banner: string }>(
      `${this.gamesEndpoint}/${gameId}/uploads/banner`,
      formData,
    );
  }
}
