import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  RouterOutlet,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {}

  userLoggedIn = false;
  userNick: string = '';
  userisAdmin = false;

  ngOnInit() {
    this.loginService.sessionState.subscribe((val) => {
      this.userLoggedIn = val;
      this.userNick = this.loginService.currentUserData.nick;
    });

    if (this.userLoggedIn) {
      const user = this.loginService.currentUserData;
      this.userisAdmin = user.is_admin;
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/homepage']);
  }
}
