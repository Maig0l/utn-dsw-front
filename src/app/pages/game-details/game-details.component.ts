import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';

import { Input, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../model/game.model';
import { Review } from '../../model/review.model';
import { Studio } from '../../model/studio.model';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { LoginService } from '../../services/auth/login.service.js';
import { ReviewCardGameComponent } from "../../components/review-card-game/review-card-game.component";

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
    ReviewFormComponent,
    ReviewCardGameComponent
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
  ) { }

  sessionType: boolean = false; //logged in or not

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

  ngOnInit() {
    this.gameId = +this.route.snapshot.paramMap.get('id')!;

    this.loginService.sessionState.subscribe(val => this.sessionType = val);

    this.fetchGameData();

    this.resetTimer();
  }

  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
  }

  fetchGameData() {
    this.gameService.getOneGame(this.gameId).subscribe((response) => {
      this.game = response;
      this.score = parseFloat(
        (this.game.cumulativeRating / this.game.reviewCount).toFixed(1),
      );
      console.log('GAME: ', this.game);

      this.devs = this.game.studios.filter(
        (studio) => studio.type === 'Developer',
      );
      this.pubs = this.game.studios.filter(
        (studio) => studio.type === 'Publisher',
      );

      this.fetchReviews();
    });
  }

  fetchReviews() {
    this.reviewService.getReviewsByGame(this.game.id).subscribe(res => {
      this.reviews = res.data.sort((a: Review, b: Review) => b.createdAt.getTime() - a.createdAt.getTime());
      this.reviewCount = res.data.length;
    });
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
    return pic.url;
  }

  // DELETE GAME ( TODO: maybe inside edit game??)
  deleteGame() {
    console.log('deleting game');
    this.gameService.deleteGame(this.gameId ?? 0).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/homepage']);
    });
  }

  reloadReviews(success: boolean) {
    const msg = success ?
      "Review sent successfully" :
      "Something failed. Have you selected a score?";

    alert(msg);
  }
}
