import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {API_URL} from "../../../main";
import {Review} from "../../model/review.type";

export interface IReview {
  id: number
  author: number
  game: number
  score: number /*for now*/
  title: string
  body: string
}

export type ReviewPostBody = {
  score: number;
  title: string | undefined;
  body: string | undefined;
}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class ReviewService {
  http = inject(HttpClient);
  reviewsEndpoint = `${API_URL}/reviews`;

  getAllReviews() {
    return this.http
      .get<ApiResponse>(this.reviewsEndpoint)
      .pipe(
        map(res => res.data as Review[])
      )
  }

  postReview(userToken: string, gameId: number, postBody: ReviewPostBody) {
    const authHeader = `Bearer ${userToken}`;
    const endpoint = `${API_URL}/games/${gameId}/reviews`;
    return this.http.post<ApiResponse>(
      endpoint,
      postBody,
      {
        headers: {authorization: authHeader},
      }
    )
  }

  /** @deprecated */
  addReview(author: number, game: number, score: number, title: string, body: string): Observable<IReview> {
    return this.http.post<IReview>(this.reviewsEndpoint, { author, game, score, title, body })
  }

}
