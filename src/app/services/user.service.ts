import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../main';
import { User } from '../model/user.model';
import { ApiResponse } from '../model/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  usersEndpoint = `${API_URL}/users`;

  getAllUsers() {
    return this.http
      .get<ApiResponse<User[]>>(this.usersEndpoint)
      .pipe(map((res) => res.data as User[]));
  }

  getUserByNick(nick: string) {
    return this.http
      .get<ApiResponse<User>>(`${this.usersEndpoint}/${nick}`)
      .pipe(map((res) => res.data as User));
  }

  getUserById(userId: number) {
    const endpoint = `${this.usersEndpoint}/${userId}`;
    return this.http
      .get<ApiResponse<User>>(endpoint)
      .pipe(map((res) => res.data));
  }

  updateUser(
    id: number,
    nick: string,
    profile_img: string,
    bio_text: string,
    linked_accounts: string[],
    likedTags: number[],
  ): Observable<User> {
    const url = `${this.usersEndpoint}/${id}`;
    return this.http.patch<User>(url, {
      id,
      nick,
      profile_img,
      bio_text,
      linked_accounts,
      likedTags,
    });
  }

  uploadProfileImg(
    userToken: string,
    userId: number,
    file: File,
  ): Observable<User> {
    const authHeader = `Bearer ${userToken}`;
    const formData = new FormData();
    formData.append('profile_img', file);
    return this.http.patch<User>(
      `${this.usersEndpoint}/me/profile_img`,
      formData,
      {
        headers: { authorization: authHeader },
      },
    );
  }

  deleteUser(userId: number): Observable<User> {
    const endpoint = `${this.usersEndpoint}/${userId}`;
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication required');
    }

    const headers = { authorization: `Bearer ${token}` };

    return this.http
      .delete<ApiResponse<User>>(endpoint, { headers })
      .pipe(map((res) => res.data));
  }
}
