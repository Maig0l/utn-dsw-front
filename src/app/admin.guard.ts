import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { LoginService } from "./services/auth/login.service.js";

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const login = this.authService.isLoggedIn(); 
    if (login) {
        const user = this.authService.currentUserData;
        if(user.is_admin){                     // con is_admin true accede a los cruds
            return true
        }
        else{
            return false
        }
    } else {
      
      return false;
    }
  }
}