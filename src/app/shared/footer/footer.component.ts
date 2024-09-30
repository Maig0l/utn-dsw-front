import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  currentYear: number = 0;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentYear = new Date().getFullYear();
    }
  }
}