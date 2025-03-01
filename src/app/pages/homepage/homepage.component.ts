import { CommonModule } from '@angular/common';
import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/auth/login.service.js';
import { User } from '../../model/user.model';
import { ViewGameComponent } from '../../components/view-game/view-game.component.js';
import { IReview, ReviewService } from '../../services/review.service';
import {ReviewCardComponent} from "../../components/review-card/review-card.component";
import {Review} from "../../model/review.model";
import {catchError} from "rxjs";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ViewGameComponent, ReviewCardComponent],
  providers: [ReviewService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements OnDestroy {
  userLoginOn: boolean = false;
  userData?: User;
  //reviews = signal(Array<Review>());
  reviews = signal<Array<Review>>([]);

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

    this.reviewService.getAllReviews()
      .pipe(
        catchError(err => {
          console.error(err)
          throw err
        })
      )
      .subscribe(reviews => {
        this.reviews.set(reviews);
      })
  }
}
/* hay que forzar una actualización de la página para
que cada vez que se acceda a la misma, se vuelvan a mostrar los jueguitos*/
