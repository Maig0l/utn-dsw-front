import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Game, GameService } from '../../components/services/game.service';
import { Review, ReviewService } from '../../components/services/review.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from "../../components/review/review.component";

import { Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, startWith, Subject, switchMap, timer} from 'rxjs';

export interface SlideInterface {
  url: string;
  title: string;
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ReviewComponent],
  providers: [RouterOutlet, GameService, ReviewService],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  @Input() slides: SlideInterface[] = [];
  currentIndex: number = 0;
  timeoutId?: number;


    reviewForm = new FormGroup({
      score: new FormControl(0),
      title: new FormControl(''),
      body: new FormControl(''),
    });
  
    gameId!: number;
    game!: Game;
    review!: Review;
    editing!: boolean;

  constructor(private route: ActivatedRoute, private gameService: GameService, private  reviewService: ReviewService ) {}
    
  ngOnInit() {
      this.gameId = +this.route.snapshot.paramMap.get('id')!
      this.getGameDetails();
      console.log(this.game.reviews)
      this.resetTimer();
  }
  ngOnDestroy() {
    window.clearTimeout(this.timeoutId);
  }

  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.goToNext(), 3000);
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slides.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl() {
    return `url('${this.slides[this.currentIndex].url}')`;
  }












  getGameDetails() {
      this.gameService.getOneGame(this.gameId).subscribe(response  => {
          this.game = response
      });
  }

}
