import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../components/services/auth/login.service.js';
import { User } from '../../components/services/auth/user.js';
import { ViewGameComponent } from '../../game/view-game/view-game.component.js';
import { Review, ReviewService } from '../../components/services/review.service.js';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ViewGameComponent],
  providers: [ReviewService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements OnDestroy {
  userLoginOn: boolean = false;
  userData?: User;
  reviews!: Review[];

  constructor(private router: Router, private loginService: LoginService, private  reviewService: ReviewService ) {}
  ngOnDestroy(): void {
    // Clean up subscriptions to avoid memory leaks
    this.loginService.currentUserLoginOn.unsubscribe();
    this.loginService.currentUserData.unsubscribe();
  }
      redirect(path: string) {
      this.router.navigate([path]); // Funcion para redirigir a una ruta
  }
  ngOnInit() {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => this.userLoginOn = userLoginOn
    });
    this.loginService.currentUserData.subscribe({
      next: (userData) => this.userData = userData
  });
  this.reviewService.getAllReviews().subscribe({
    next: (reviews) => this.reviews = reviews
  });
}
}
/* hay que forzar una actualización de la página para
que cada vez que se acceda a la misma, se vuelvan a mostrar los jueguitos*/