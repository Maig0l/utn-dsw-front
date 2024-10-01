import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  userLoginOn: boolean = false;

    constructor(private router: Router) {}

    redirect(path: string) {
      this.router.navigate([path]); // Funcion para redirigir a una ruta
  }
  
}
