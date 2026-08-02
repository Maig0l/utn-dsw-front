import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../main';
import { User } from '../model/user.model';
import { Tag } from '../model/tag.model';
import { ApiResponse } from '../model/apiResponse.model';

// Forma en la que el backend devuelve un usuario (UserResponseDTO)
interface UserResponseDTO {
  id: number;
  nick: string;
  email: string;
  profileImg?: string;
  biographyText?: string;
  role: string;
  linkedAccounts?: string[];
  likedTags?: { id: number; name: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  usersEndpoint = `${API_URL}/users`;

  private mapUserResponse(dto: UserResponseDTO): User {
    const likedTags: Tag[] = (dto.likedTags ?? []).map(
      (tag) =>
        ({
          id: tag.id,
          name: tag.name,
          description: '',
          games: [],
        }) as unknown as Tag,
    );

    return {
      id: dto.id,
      nick: dto.nick,
      email: dto.email,
      profile_img: dto.profileImg,
      bio_text: dto.biographyText,
      is_admin: dto.role === 'ADMIN',
      linked_accounts: dto.linkedAccounts ?? [],
      playlists: [],
      likedTags,
      reviews: [],
    };
  }

  getAllUsers() {
    return this.http
      .get<ApiResponse<UserResponseDTO[]>>(this.usersEndpoint)
      .pipe(map((res) => res.data.map((dto) => this.mapUserResponse(dto))));
  }

  getUserByNick(nick: string) {
    return this.http
      .get<ApiResponse<UserResponseDTO>>(`${this.usersEndpoint}/by-nick/${nick}`)
      .pipe(map((res) => this.mapUserResponse(res.data)));
  }

  getUserById(userId: number) {
    const endpoint = `${this.usersEndpoint}/${userId}`;
    return this.http
      .get<ApiResponse<UserResponseDTO>>(endpoint)
      .pipe(map((res) => this.mapUserResponse(res.data)));
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
    return this.http
      .patch<ApiResponse<UserResponseDTO>>(url, {
        nick,
        profileImg: profile_img,
        biographyText: bio_text,
        linkedAccounts: linked_accounts,
        likedTags,
      })
      .pipe(map((res) => this.mapUserResponse(res.data)));
  }

  uploadProfileImg(
    userToken: string,
    userId: number,
    file: File,
  ): Observable<User> {
    const authHeader = `Bearer ${userToken}`;
    const formData = new FormData();
    formData.append('profile_img', file);
    return this.http
      .patch<ApiResponse<UserResponseDTO>>(
        `${this.usersEndpoint}/me/profile_img`,
        formData,
        {
          headers: { authorization: authHeader },
        },
      )
      .pipe(map((res) => this.mapUserResponse(res.data)));
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
