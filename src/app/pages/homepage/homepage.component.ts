import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../model/user.model';
import { ViewGameComponent } from '../../components/view-game/view-game.component';
import { ReviewService } from '../../services/review.service';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { Review } from '../../model/review.model';
import { catchError } from 'rxjs';
import { Game } from '../../model/game.model';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, ViewGameComponent, ReviewCardComponent],
  providers: [ReviewService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  userLoginOn = false;
  userData?: User;
  reviews: Review[] = [];
  hotGames: Game[] = [];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private reviewService: ReviewService,
    private gameService: GameService,
  ) {}

  // ngOnDestroy(): void {
  //   Clean up subscriptions to avoid memory leaks
  //   TODO: Rehacer el componente de auth entero
  //   TODO: Estas dos líneas eran las que hacían que tirara error en la homepage
  //   this.loginService.currentUserLoginOn.unsubscribe();
  //   this.loginService.currentUserData.unsubscribe();
  // }

  redirect(path: string) {
    this.router.navigate([path]); // Funcion para redirigir a una ruta
  }

  ngOnInit() {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => (this.userLoginOn = userLoginOn),
    });

    this.loginService.currentUserData.subscribe({
      //next: (userData) => this.userData = userData
    });

    this.reviewService
      .getAllReviews()
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        }),
      )
      .subscribe((reviews) => {
        this.reviews = reviews;
      });

    this.gameService
      .getHotGames()
      .subscribe((games) => (this.hotGames = games));
  }
}
/* hay que forzar una actualización de la página para
que cada vez que se acceda a la misma, se vuelvan a mostrar los jueguitos*/
