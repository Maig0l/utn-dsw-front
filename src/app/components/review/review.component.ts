import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Game } from '../../model/game.model';
import { Review } from '../../model/review.model';
import { environment } from '../../../enviroment/enviroment';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  providers: [RouterOutlet, GameService, ReviewService],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  reviewForm = new FormGroup({
    score: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
  });

  gameId!: number;
  game!: Game;
  review!: Review;
  gamePortraitUrl = '';

  hoverRating = 0;

  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private reviewService: ReviewService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Obtén el ID del juego desde la URL
    this.gameId = +this.route.snapshot.paramMap.get('id')!;
    // Usa el servicio para obtener los detalles del juego
    this.getGameDetails();
  }

  getGameDetails() {
    this.gameService.getOneGame(this.gameId).subscribe((response) => {
      this.game = response;
    });
  }

  setRating(rating: number): void {
    this.reviewForm.get('score')?.setValue(rating);
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  getRatingLabel(score: number): string {
    if (!score || score < 1 || score > 5) return '';
    switch (score) {
      case 1:
        return 'Moonshame';
      case 2:
        return 'Moonster';
      case 3:
        return 'Moonotone';
      case 4:
        return 'Moonafic';
      case 5:
        return 'Lunar Tear';
      default:
        return '';
    }
  }

  addReview() {
    const score = Number.parseInt(
      this.reviewForm.value.score?.toString() ?? '0',
    );

    this.reviewService
      .addReview(
        1 /*falta implementar usuario*/,
        this.gameId,
        score,
        this.reviewForm.value.title ?? '',
        this.reviewForm.value.body ?? '',
      )
      .subscribe((responseReview) => (this.review = responseReview));
    this.router.navigate([`/game/${this.gameId}`]);
  }
}
