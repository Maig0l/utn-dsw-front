import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../main';
import { Review } from '../model/review.model';
import { ApiResponse } from '../model/apiResponse.model';
import { User } from '../model/user.model';

export interface ReviewPostBody {
  score: number;
  title: string | undefined;
  body: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  http = inject(HttpClient);
  reviewsEndpoint = `${API_URL}/reviews`;

  getAllReviews() {
    return this.http
      .get<ApiResponse<Review[]>>(this.reviewsEndpoint)
      .pipe(map((res) => res.data as Review[]));
  }

  getReviewsByAuthor(user: User) {
    const resourcePath = `${API_URL}/users/${user.nick}/reviews`;

    return this.http
      .get<ApiResponse<Review[]>>(resourcePath)
      .pipe(map((res) => res.data as Review[]));
  }

  getReviewsByGame(gameId: number) {
    const endpoint = `${API_URL}/games/${gameId}/reviews`;

    // Necesito que cuando llegue `res`, se le parsee el atributo `createdAt` de cada Review como instancia de Date
    return this.http.get<ApiResponse<Review[]>>(endpoint).pipe(
      map((res) => {
        res.data.forEach(
          (review) => (review.createdAt = new Date(review.createdAt)),
        );
        return res;
      }),
    );
  }

  postReview(userToken: string, gameId: number, postBody: ReviewPostBody) {
    const authHeader = `Bearer ${userToken}`;
    const endpoint = `${API_URL}/games/${gameId}/reviews`;
    return this.http.post<ApiResponse<Review>>(endpoint, postBody, {
      headers: { authorization: authHeader },
    });
  }

  deleteReview(userToken: string, reviewId: number) {
    const authHeader = `Bearer ${userToken}`;
    const endpoint = `${this.reviewsEndpoint}/${reviewId}`;
    return this.http.delete<ApiResponse<any>>(endpoint, {
      headers: { authorization: authHeader },
    });
  }

  updateReview(userToken: string, reviewId: number, postBody: ReviewPostBody) {
    const authHeader = `Bearer ${userToken}`;
    const endpoint = `${this.reviewsEndpoint}/${reviewId}`;
    return this.http.patch<ApiResponse<Review>>(endpoint, postBody, {
      headers: { authorization: authHeader },
    });
  }

  /** @deprecated Use postReview instead */
  addReview(
    author: number,
    game: number,
    score: number,
    title: string,
    body: string,
  ): Observable<Review> {
    return this.http.post<Review>(this.reviewsEndpoint, {
      author,
      game,
      score,
      title,
      body,
    });
  }
}
