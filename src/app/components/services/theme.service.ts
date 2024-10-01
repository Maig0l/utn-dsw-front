import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme) {
        this.setDarkMode(savedTheme === 'true');
      } else {
        this.setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode.value);
  }

  setDarkMode(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', isDark.toString());
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
    this.isDarkMode.next(isDark);
  }
}

/*
It's worth noting that when using the `async` pipe, you should be careful in scenarios where 
the same async pipe is used multiple times in a template, as it can lead to multiple subscriptions. 
In such cases, you might want to use the `*ngIf as` syntax 
or the `*ngLet` directive (from the `@ngrx/component` package) to subscribe once and reuse the value.
*/