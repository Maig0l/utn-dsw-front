import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RegisterRequest } from './registerRequest';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  private registerEndpoint = 'http://localhost:8080/api/register'; // URL del backend para el registro

  register(credentials: RegisterRequest): Observable<User> {
    return this.http.post<User>(this.registerEndpoint, credentials).pipe(
      catchError(this.handleError), // Manejo de errores
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
