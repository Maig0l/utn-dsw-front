import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { LoginService } from '../../components/services/auth/login.service.js';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnDestroy {
  userLoginOn: boolean = false;

    constructor(private router: Router, private loginService: LoginService) {}

    ngOnInit() {  
      this.loginService.currentUserLoginOn.subscribe({
        next: (userLoginOn) => this.userLoginOn = userLoginOn
      })
    }
    
    redirect(path: string) {
      this.router.navigate([path]); // Funcion para redirigir a una ruta
  }

  ngOnDestroy(): void {
    this.loginService.currentUserLoginOn.unsubscribe();
    this.loginService.currentUserData.unsubscribe();
  }
  }
