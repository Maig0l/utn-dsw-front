import { Component, input } from '@angular/core';
import {Review} from "../../model/review.type";

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent {
  review = input.required<Review>()
}
