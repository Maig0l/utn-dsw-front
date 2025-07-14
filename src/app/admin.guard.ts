import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './services/auth/login.service.js';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private authService: LoginService,
    private router: Router,
  ) {}

  /**
   * Usado para los CRUDs de entidades.
   * Sólo se puede acceder si está logueado y el user es admin
   */
  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) return false;

    const user = this.authService.currentUserData;
    return user.is_admin;
  }
}
