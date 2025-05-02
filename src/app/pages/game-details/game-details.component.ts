import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReviewComponent } from '../../components/review/review.component';

import { Input, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../model/game.model';
import { Review } from '../../model/review.model';
import { Studio } from '../../model/studio.model';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { environment } from '../../../enviroment/enviroment';

export interface SlideInterface {
  id: number;
  url: string;
  game: number;
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReviewComponent,
    NgOptimizedImage,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
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
  ) {}

  @Input() slides: SlideInterface[] = [];
  currentIndex = 0;
  timeoutId?: number;

  gameId!: number;
  game!: Game;
  review!: Review;
  editing!: boolean;
  devs: Studio[] = [];
  pubs: Studio[] = [];

  reviewForm = new FormGroup({
    score: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
  });

  apiUrl = environment.apiUrl;

  ngOnInit() {
    this.gameId = +this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOneGame(this.gameId).subscribe((response) => {
      this.game = response;
      console.log('GAME: ', this.game);
      this.devs = this.game.studios.filter(
        (studio) => studio.type === 'Developer',
      );
      this.pubs = this.game.studios.filter(
        (studio) => studio.type === 'Publisher',
      );
    });
    this.resetTimer();
  }
  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
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
}
