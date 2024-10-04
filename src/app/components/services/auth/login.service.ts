import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}


interface User { //TODO
  id: number;
  nick: string;
  email: string;
  profile_img?: string;
  bio_text?: string;
  linked_accounts?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginEndpoint = "http://localhost:8080/api/log-in"


  login(credentials: LoginRequest): Observable<User> {
    return this.http.get<User>('./././assets/data.json').pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error("An error occurred:", error.error);
    } else {  
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(()=> new Error("Something bad happened; please try again later."));
  }

}
