import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Playlist} from "../model/playlist.model";
import {ApiResponse} from "../model/apiResponse.model";


@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient) {}

  playlistEndpoint = 'http://localhost:8080/api/playlists';

  getPlaylistsByOwner(owner: number): Observable<Playlist[]> {
    const url = this.playlistEndpoint + `/search?owner=${owner}`;
    console.log(url);
    return this.http
      .get<ApiResponse<Playlist[]>>(url)
      .pipe(map((response) => response.data));
  }

  getAllPlaylists(): Observable<Playlist[]> {
    return (
      this.http
        .get<ApiResponse<Playlist[]>>(this.playlistEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data))
    );
  }

  addPlaylist(
    name: string,
    description: string,
    is_private: boolean,
    owner: number,
    games: number[]
  ): Observable<Playlist> {
    return this.http.post<Playlist>(this.playlistEndpoint, {
      name,
      description,
      is_private,
      owner,
      games,
    });
  }

  updatePlaylist(
    id: number,
    name: string,
    description: string,
    is_private: boolean,
    owner: number,
    games: number
  ): Observable<Playlist> {
    const url = this.playlistEndpoint + `/${id}`;
    return this.http.put<Playlist>(url, {
      id,
      name,
      description,
      is_private,
      owner,
      games,
    });
  }

  deletePlaylist(id: number): Observable<Playlist> {
    const url = this.playlistEndpoint + `/${id}`;
    return this.http.delete<ApiResponse<Playlist>>(url).pipe(map((res) => res.data));
  }

  getOnePlaylist(id: number): Observable<Playlist> {
    const url = this.playlistEndpoint + `/${id}`;
    return this.http
      .get<ApiResponse<Playlist>>(url)
      .pipe(map((response) => response.data));
  }
}
