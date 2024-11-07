import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from './loginRequest.js';
import { User } from './user.js';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  
  constructor(private http: HttpClient) { 
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
    this.currentUserData=new BehaviorSubject<User>({} as User);
  }

  loginEndpoint = "http://localhost:8080/api/log-in"


  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<any>(this.loginEndpoint+"auth/login",credentials).pipe(
      tap((userData) => { //Por que no  hay que poner el tipo User?
        sessionStorage.setItem("token", userData.token);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);        
      }),
      map((userData) => userData), //???
      catchError(this.handleError)
    );
  }

  logout():void{
    sessionStorage.removeItem("token");
    this.currentUserLoginOn.next(false);
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
  get userToken():String{
    return this.userToken;
  }
}
