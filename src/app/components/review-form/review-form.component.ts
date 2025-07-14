import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../model/game.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReviewPostBody, ReviewService } from '../../services/review.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service.js';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent {
  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private loginService: LoginService,
  ) { }

  @Input({ required: true }) game!: Game;
  @Output("onSubmit") submitSuccessful = new EventEmitter<boolean>();

  reviewForm = new FormGroup({
    score: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
  });

  hoverRating = 0;

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

    const newReview: ReviewPostBody = {
      score: score,
      title: this.reviewForm.value.title ?? '',
      body: this.reviewForm.value.body ?? '',
    }

    this.reviewService.postReview(
      this.loginService.currentUserToken,
      this.game.id,
      newReview)
      .subscribe({
        next: res => new this.submitSuccessful(res.data ? true : false)
      });
  }
}
