import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../components/services/auth/login.service.js';
import { User } from '../../components/services/auth/user.js';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements OnDestroy {
  userLoginOn: boolean = false;
  userData?: User;

  constructor(private router: Router, private loginService: LoginService) {}
      redirect(path: string) {
      this.router.navigate([path]); // Funcion para redirigir a una ruta
  }
  ngOnInit() {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => this.userLoginOn = userLoginOn
    });
    this.loginService.currentUserData.subscribe({
      next: (userData) => this.userData = userData
  })
  }
  ngOnDestroy(): void {
    this.loginService.currentUserLoginOn.unsubscribe();
    this.loginService.currentUserData.unsubscribe();
  }

}
