import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Playlist } from '../../model/playlist.model';

interface ApiResponse {
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient) {}

  playlistEndpoint = 'http://localhost:8080/api/playlists';

  getPlaylistsByOwner(owner: number): Observable<Playlist[]> {
    const url = this.playlistEndpoint + `/search?owner=${owner}`;
    return this.http
      .get<ApiResponse>(url)
      .pipe(map((response) => response.data));
  }

  getAllPlaylists(): Observable<Playlist[]> {
    return (
      this.http
        .get<ApiResponse>(this.playlistEndpoint)
        // Devuelve lo que está dentro de data en el objeto de respuesta
        .pipe(map((response) => response.data))
    );
  }

  addPlaylist(
    name: string,
    description: string,
    isPrivate: boolean,
    owner: number,
    games: number[],
  ): Observable<Playlist> {
    return this.http.post<Playlist>(this.playlistEndpoint, {
      name,
      description,
      isPrivate,
      owner,
      games,
    });
  }

  updatePlaylist(
    id: number,
    name: string,
    description: string,
    isPrivate: boolean,
    owner: number,
    games: number[],
  ): Observable<Playlist> {
    const url = this.playlistEndpoint + `/${id}`;
    return this.http.put<Playlist>(url, {
      name,
      description,
      isPrivate,
      games,
    });
  }

  deletePlaylist(id: number): Observable<Playlist> {
    const url = this.playlistEndpoint + `/${id}`;
    return this.http.delete<ApiResponse>(url).pipe(map((res) => res.data));
  }

  getOnePlaylist(id: number): Observable<Playlist> {
    const url = this.playlistEndpoint + `/${id}`;
    return this.http
      .get<ApiResponse>(url)
      .pipe(map((response) => response.data));
  }
}
