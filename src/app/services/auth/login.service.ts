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
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../model/user.model';

type loginResponse = ApiResponse<{ token: string }>;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
  ) {}

  loginEndpoint = `${API_URL}/users/login`;

  private _sessionState = new BehaviorSubject<boolean>(this.isLoggedIn());

  get sessionState() {
    return this._sessionState.asObservable();
  }

  login(credentials: LoginRequest) {
    return this.http.post<loginResponse>(this.loginEndpoint, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.data.token);
        this._sessionState.next(true);
      }),
      catchError(this.handleError),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._sessionState.next(false);
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

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const tokenData = this.jwt.decodeToken(token);
    if (this.jwt.isTokenExpired(token) && tokenData.sub === 'UserDataToken') {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  }

  get currentUserData(): User {
    if (!this.isLoggedIn())
      throw Error('User is not logged in. Check with isLoggedIn first');

    // isLoggedIn ya asegura que el token en localStorage no es nulo
    //  y que el tipo del token corresponde al token de usuario de Wellplayed
    return this.jwt.decodeToken<User>(
      localStorage.getItem('token') as string,
    ) as User;
  }
}
