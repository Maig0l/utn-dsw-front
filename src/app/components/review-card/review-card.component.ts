import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../model/review.model';
import { environment } from '../../../enviroment/enviroment.js';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  review = input.required<Review>();
  apiUrl = environment.apiUrl;
}
