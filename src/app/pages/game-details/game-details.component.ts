import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ReviewService } from '../../services/review.service';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { linkToStaticResource } from '../../../enviroment/enviroment';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';

import { Input, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../model/game.model';
import { Review } from '../../model/review.model';
import { Studio } from '../../model/studio.model';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { LoginService } from '../../services/auth/login.service';
import { ReviewCardGameComponent } from '../../components/review-card-game/review-card-game.component';

export interface SlideInterface {
  id: number;
  url: string;
  game: number;
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    ReviewFormComponent,
    ReviewCardGameComponent,
  ],
  providers: [RouterOutlet, GameService, ReviewService],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private reviewService: ReviewService,
    private router: Router,
    private loginService: LoginService,
  ) {}

  sessionType = false; //logged in or not

  @Input() slides: SlideInterface[] = [];
  currentIndex = 0;
  timeoutId?: number;

  gameId!: number;
  game!: Game;
  review!: Review;
  editing!: boolean;
  devs: Studio[] = [];
  pubs: Studio[] = [];

  reviews: Review[] = [];
  reviewCount = 0;
  score = 0;

  // Para controlar si el usuario actual ya tiene una review
  currentUserHasReview = false;
  currentUserReview: Review | null = null;
  otherUsersReviews: Review[] = [];

  // Para controlar el estado de edición de la review del usuario
  isEditingUserReview = false;

  // Función para manejar recursos estáticos
  protected readonly linkToStaticResource = linkToStaticResource;

  ngOnInit() {
    this.gameId = +this.route.snapshot.paramMap.get('id')!;

    this.loginService.sessionState.subscribe((val) => {
      this.sessionType = val;
      // Verificar reviews cuando cambie el estado de sesión
      if (this.reviews.length > 0) {
        this.checkCurrentUserReview();
      }
    });

    this.fetchGameData();

    this.resetTimer();
  }

  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
  }

  fetchGameData() {
    this.gameService.getOneGame(this.gameId).subscribe((response) => {
      this.game = response;
      // Verificar si hay reviews antes de calcular el score
      if (this.game.reviewCount > 0) {
        this.score = parseFloat(
          (this.game.cumulativeRating / this.game.reviewCount).toFixed(1),
        );
      } else {
        this.score = 0; // Sin reviews, score es 0
      }
      console.log('GAME: ', this.game);

      this.devs = this.game.studios.filter(
        (studio) => studio.type === 'Developer' || studio.type === 'Both',
      );
      console.log('DEVS: ', this.devs);

      this.pubs = this.game.studios.filter(
        (studio) => studio.type === 'Publisher' || studio.type === 'Both',
      );
      console.log('PUBS: ', this.pubs);
      console.log('PLATFORMS: ', this.game.platforms);

      this.fetchReviews();
    });
  }

  fetchReviews() {
    this.reviewService.getReviewsByGame(this.game.id).subscribe((res) => {
      this.reviews = res.data.sort(
        (a: Review, b: Review) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      this.reviewCount = res.data.length;

      // Verificar si el usuario actual ya tiene una review
      this.checkCurrentUserReview();
    });
  }

  // Método para refrescar tanto el juego como las reviews
  refreshGameAndReviews() {
    // Refrescar los datos del juego para obtener el rating actualizado
    this.gameService.getOneGame(this.gameId).subscribe((response) => {
      this.game = response;
      // Verificar si hay reviews antes de calcular el score
      if (this.game.reviewCount > 0) {
        this.score = parseFloat(
          (this.game.cumulativeRating / this.game.reviewCount).toFixed(1),
        );
      } else {
        this.score = 0; // Sin reviews, score es 0
      }

      // Después refrescar las reviews
      this.fetchReviews();
    });
  }

  // Método para verificar si el usuario actual ya tiene una review
  checkCurrentUserReview() {
    this.currentUserHasReview = false;
    this.currentUserReview = null;
    this.otherUsersReviews = [];

    if (this.loginService.isLoggedIn() && this.reviews.length > 0) {
      const currentUser = this.loginService.currentUserData;

      // Separar la review del usuario actual de las demás
      this.reviews.forEach((review) => {
        if (review.author.id === currentUser.id) {
          this.currentUserReview = review;
          this.currentUserHasReview = true;
        } else {
          this.otherUsersReviews.push(review);
        }
      });
    } else {
      // Si no está logueado, todas las reviews van a otherUsersReviews
      this.otherUsersReviews = [...this.reviews];
    }
  }

  openModal() {
    const deleteModal = document.getElementById(
      'deleteModal',
    ) as HTMLDialogElement;
    deleteModal.showModal();
  }

  closeModal() {
    const deleteModal = document.getElementById(
      'deleteModal',
    ) as HTMLDialogElement;
    deleteModal.close();
  }

  // TODO: If this is for the carousel, why is it in OnInit
  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.goToNext(), 3000);
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.game.pictures.length - 1
      : this.currentIndex - 1;
    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.game.pictures.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;
    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl() {
    const pic = JSON.parse(
      JSON.stringify(this.game.pictures[this.currentIndex]),
    );
    return linkToStaticResource(pic.url);
  }

  getGameBanner() {
    return linkToStaticResource(this.game?.banner);
  }

  getGamePortrait() {
    return linkToStaticResource(this.game?.portrait);
  }

  // DELETE GAME ( TODO: maybe inside edit game??)
  deleteGame() {
    console.log('deleting game');
    this.gameService.deleteGame(this.gameId ?? 0).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/homepage']);
    });
  }

  // Check if current user is admin
  isUserAdmin(): boolean {
    if (!this.loginService.isLoggedIn()) {
      return false;
    }
    const userData = this.loginService.currentUserData;
    return userData.is_admin;
  }

  // Verificar si el usuario puede escribir una review (está logueado y no tiene una review ya)
  canWriteReview(): boolean {
    return this.loginService.isLoggedIn() && !this.currentUserHasReview;
  }

  reloadReviews(success: boolean) {
    const msg = success
      ? 'Review sent successfully'
      : 'Something failed. Have you selected a score?';

    alert(msg);

    // Recargar juego y reviews si fue exitoso para actualizar el estado
    if (success) {
      this.refreshGameAndReviews();
    }
  }

  // Eliminar la review del usuario actual
  deleteUserReview() {
    if (!this.currentUserReview) return;

    const confirmDelete = confirm(
      'Are you sure you want to delete your review? This action cannot be undone.',
    );

    if (confirmDelete) {
      this.reviewService
        .deleteReview(
          this.loginService.currentUserToken,
          this.currentUserReview.id,
        )
        .subscribe({
          next: () => {
            alert('Review deleted successfully!');
            this.refreshGameAndReviews(); // Actualizar tanto el juego como las reviews
          },
          error: (error) => {
            console.error('Error deleting review:', error);
            alert('Failed to delete review. Please try again.');
          },
        });
    }
  }

  // Iniciar edición de la review del usuario
  startEditingUserReview() {
    this.isEditingUserReview = true;
  }

  // Cancelar edición de la review del usuario
  cancelEditingUserReview() {
    this.isEditingUserReview = false;
  }

  // Manejar cuando se actualiza la review del usuario
  onUserReviewUpdated(success: boolean) {
    if (success) {
      this.isEditingUserReview = false;
      this.refreshGameAndReviews(); // Actualizar tanto el juego como las reviews
      alert('Review updated successfully!');
    } else {
      alert('Failed to update review. Please try again.');
    }
  }
}
