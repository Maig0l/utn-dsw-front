import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Game } from '../../model/game.model';
import { Review } from '../../model/review.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReviewPostBody, ReviewService } from '../../services/review.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent implements OnInit {
  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private loginService: LoginService,
  ) {}

  @Input({ required: true }) game!: Game;
  @Input() existingReview?: Review; // Para edición
  @Output('onSubmit') submitSuccessful = new EventEmitter<boolean>();

  reviewForm = new FormGroup({
    score: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
  });

  hoverRating = 0;

  ngOnInit() {
    // Si hay una review existente, populamos el formulario con sus datos
    if (this.existingReview) {
      this.reviewForm.patchValue({
        score: this.existingReview.score,
        title: this.existingReview.title,
        body: this.existingReview.body,
      });
    }
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

    const reviewData: ReviewPostBody = {
      score: score,
      title: this.reviewForm.value.title ?? '',
      body: this.reviewForm.value.body ?? '',
    };

    // Si hay una review existente, actualizar; si no, crear nueva
    if (this.existingReview) {
      this.reviewService
        .updateReview(
          this.loginService.currentUserToken,
          this.existingReview.id,
          reviewData,
        )
        .subscribe({
          next: (res) => this.submitSuccessful.emit(res.data ? true : false),
          error: (err) => {
            console.error('Error updating review:', err);
            this.submitSuccessful.emit(false);
          },
        });
    } else {
      this.reviewService
        .postReview(
          this.loginService.currentUserToken,
          this.game.id,
          reviewData,
        )
        .subscribe({
          next: (res) => this.submitSuccessful.emit(res.data ? true : false),
          error: (err) => {
            console.error('Error creating review:', err);
            this.submitSuccessful.emit(false);
          },
        });
    }
  }
}
