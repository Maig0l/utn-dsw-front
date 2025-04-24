import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { LoginRequest } from './loginRequest';
import { API_URL } from '../../../main';
import { ApiResponse } from '../../model/apiResponse.model';

type loginResponse = ApiResponse<{ token: string }>;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUserLoginOn = new BehaviorSubject<boolean>(false);
  currentUserData = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  loginEndpoint = `${API_URL}/users/login`;

  login(credentials: LoginRequest) {
    return this.http.post<loginResponse>(this.loginEndpoint, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.data.token);
        this.currentUserData.next(response.data.token);
        this.currentUserLoginOn.next(true);
      }),
      map((response) => response.data), //???
      catchError(this.handleError),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserLoginOn.next(false);
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
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

  get UserData(): Observable<string> {
    return this.currentUserData.asObservable();
  }

  get LoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
  get userToken(): string {
    return this.userToken;
  }
}
