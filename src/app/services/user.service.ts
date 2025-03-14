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

  updateUser(user: User) {
    const endpoint = `${this.usersEndpoint}/${user.id}`;
    return this.http.put<ApiResponse<User>>(endpoint, user).pipe(map((res) => res.data));
  }

  deleteUser(userId: number) {
    const endpoint = `${this.usersEndpoint}/${userId}`;
    return this.http.delete<ApiResponse<User>>(endpoint).pipe(map((res) => res.data));
  }
}
