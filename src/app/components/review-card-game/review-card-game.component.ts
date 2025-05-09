import { Component, Input } from '@angular/core';
import { Review } from '../../model/review.model.js';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-review-card-game',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: './review-card-game.component.html',
  styleUrl: './review-card-game.component.css'
})
export class ReviewCardGameComponent {
  @Input() data!: Review;
}
