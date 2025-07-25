import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {}

  userLoggedIn = false;
  userNick = '';
  userisAdmin = false;

  ngOnInit() {
    this.loginService.sessionState.subscribe((loggedIn) => {
      this.userLoggedIn = loggedIn;

      if (loggedIn) {
        const userData = this.loginService.currentUserData;
        this.userNick = userData.nick;

        this.userisAdmin = Boolean(userData.is_admin);
      } else {
        this.userNick = '';
        this.userisAdmin = false;
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/homepage']);
  }
}
