import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoginService } from './services/auth/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UserProfileEditGuard implements CanActivate {
  constructor(
    private authService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  /**
   * Usado para proteger la edición de perfiles de usuario.
   * Solo permite que un usuario edite su propio perfil.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Verificar si el usuario está logueado
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in, redirecting to login');
      this.snackBar.open('Log in to edit your profile', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/log-in']);
      return false;
    }

    // Obtener el nick del perfil que se intenta editar desde la URL
    const profileNickToEdit = route.paramMap.get('nick');
    if (!profileNickToEdit) {
      console.error('No profile nick provided in route');
      this.router.navigate(['/homepage']);
      return false;
    }

    // Obtener el usuario logueado
    const currentUser = this.authService.currentUserData;

    // Verificar si el usuario logueado intenta editar su propio perfil
    if (currentUser.nick !== profileNickToEdit) {
      console.warn(
        `User ${currentUser.nick} attempted to edit profile of ${profileNickToEdit}`,
      );
      this.snackBar.open('You can only edit your own profile', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      // Redirigir al perfil del usuario logueado
      this.router.navigate(['/user', currentUser.nick]);
      return false;
    }

    return true;
  }
}
