import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest.js';
import { HttpClient } from '@angular/common/http/index.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.get('./././assets/users.json')
  }
}
