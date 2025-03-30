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

  getUserById(userId: number) {
    const endpoint = `${this.usersEndpoint}/${userId}`;
    return this.http.get<ApiResponse<User>>(endpoint).pipe(map((res) => res.data));
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

/*  deleteUser(userId: number) {
    const endpoint = `${this.usersEndpoint}/${userId}`;
    return this.http.delete<ApiResponse<User>>(endpoint).pipe(map((res) => res.data));
  }
*/
}
