import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RegisterRequest } from './registerRequest';
import { ApiResponse } from '../../model/apiResponse.model';
import { API_URL } from '../../../main';
import { LoginService } from './login.service';

type registerResponse = ApiResponse<{ token: string }>;

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) {}

  private registerEndpoint = `${API_URL}/users`; // URL del backend para el registro

  register(credentials: RegisterRequest): Observable<registerResponse> {
    return this.http.post<registerResponse>(this.registerEndpoint, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.data.token);
        this.loginService.markSessionActive();
      }),
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
      () => new Error(error.error?.message || 'An error occurred'),
    );
  }
}
