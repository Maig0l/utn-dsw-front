import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ReviewComponent } from '../../components/review/review.component';

import { Input, OnDestroy, OnInit } from '@angular/core';
import {Game} from "../../model/game.model";
import {Review} from "../../model/review.model";
import {Studio} from "../../model/studio.model";

export interface SlideInterface {
  id: number;
  url: string;
  game: number;
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ReviewComponent, NgOptimizedImage],
  providers: [RouterOutlet, GameService, ReviewService],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private reviewService: ReviewService
  ) {}

  @Input() slides: SlideInterface[] = [];
  currentIndex = 0;
  timeoutId?: number;

  gameId!: number;
  game!: Game;
  review!: Review;
  editing!: boolean;
  devs: Studio[] = []
  pubs: Studio[] = []

  reviewForm = new FormGroup({
    score: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
  });

  ngOnInit() {
    this.gameId = +this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOneGame(this.gameId).subscribe((response) => {
      this.game = response;
      this.devs = this.game.studios.filter(studio => studio.type === 'Developer')
      this.pubs = this.game.studios.filter(studio => studio.type === 'Publisher')
    });
    this.resetTimer();
  }
  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
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
      JSON.stringify(this.game.pictures[this.currentIndex])
    );
    return pic.url;
  }
}
