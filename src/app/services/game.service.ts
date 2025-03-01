import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Tag } from './tag.service';
import { Studio } from './studio.service';
import { IReview } from './review.service';
import { CollectionViewer } from '@angular/cdk/collections/index.js';
import {Review} from "../model/review.model";
import {ApiResponse} from "../model/apiResponse.model";
import {Game} from "../model/game.model";
import {Platform} from "../model/platform.model";


@Injectable()
export class GameService {
  constructor(private http: HttpClient) {}

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  gamesEndpoint = 'http://localhost:8080/api/games';

  findGamesByTitle(title: string): Observable<Game[]> {
    const url = this.gamesEndpoint + `/search?title=${title}`;
    return this.http
      .get<ApiResponse<Game[]>>(url)
      .pipe(map((response) => response.data));
  }

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
    franchise: number
  ): Observable<Game> {
    return this.http.post<Game>(this.gamesEndpoint, {
      title,
      synopsis,
      releaseDate,
      portrait,
      banner,
      franchise,
    });
  }

  addPicturesToGame(game_id: number, urls: string[]): Observable<string[]> {
    const url = 'http://localhost:8080/api/game-picture';
    return this.http.post<string[]>(url, { game_id, urls });
  }

  updateGame(
    id: number,
    title: string,
    synopsis: string,
    releaseDate: string,
    portrait: string,
    banner: string,
    pictures: string[],
    franchise: number
  ): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`;
    return this.http.patch<Game>(url, {
      id,
      title,
      synopsis,
      releaseDate,
      portrait,
      banner,
      pictures,
      franchise,
    });
  }

  deleteGame(id: number): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`;
    return this.http.delete<ApiResponse<Game>>(url).pipe(map((res) => res.data));
  }

  getOneGame(id: number): Observable<Game> {
    const url = this.gamesEndpoint + `/${id}`;
    return this.http
      .get<ApiResponse<Game>>(url)
      .pipe(map((response) => response.data));
  }
}
