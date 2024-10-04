import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
    return this.http.get<User>('./././assets/data.json')
    
    //.pipe(map(response => response.data))
  }


}
