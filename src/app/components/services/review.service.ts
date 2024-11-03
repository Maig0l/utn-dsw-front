import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Review {
  id: number
  author: number
  game: number
  score: number /*for now*/
  title: string
  body: string
}

interface ApiResponse {
  message: string
  data: any
}

@Injectable()
export class ReviewService {
  constructor(private http: HttpClient) { }

  // TODO: Guardar la URL base y rutas de endpoints en algún archivo de config global
  reviewsEndpoint = "http://localhost:8080/api/reviews"

  getAllReviews(): Observable<Review[]> {
    return this.http.get<ApiResponse>(this.reviewsEndpoint)
      // Devuelve lo que está dentro de data en el objeto de respuesta
      .pipe(map(response => response.data))
    }

  addReview(author: number, game: number, score: number, title: string, body: string): Observable<Review> {
    return this.http.post<Review>(this.reviewsEndpoint, { author, game, score, title, body })
  }

 
}