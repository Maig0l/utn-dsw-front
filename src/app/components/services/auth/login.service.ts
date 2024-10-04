import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from './loginRequest.js';
import { User } from './user.js';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({id: 0, nick: "", email: ""});
  
  constructor(private http: HttpClient) { }

  loginEndpoint = "http://localhost:8080/api/log-in"


  login(credentials: LoginRequest): Observable<User> {
    return this.http.get<User>('./././assets/data.json').pipe(
      tap((userData:User) => { 
        this.currentUserLoginOn.next(true);
        this.currentUserData.next(userData);
      }),
      catchError(this.handleError)
    );
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


  get UserData(): Observable<User> {
    return this.currentUserData.asObservable();
  }

  get LoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}
