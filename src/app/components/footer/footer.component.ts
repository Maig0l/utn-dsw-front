import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  constructor(private router: Router) {}

  redirect(path: string) {
    this.router.navigate([path]); // Funcion para redirigir a una ruta
  }

  private platformId = inject(PLATFORM_ID);
  currentYear = 0;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentYear = new Date().getFullYear();
    }
  }
}
