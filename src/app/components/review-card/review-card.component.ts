import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../model/review.model';
import { environment } from '../../../enviroment/enviroment';
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

  // Apagar para usar este componente en la página de perfil de usuario
  @Input() showProfilePicture: boolean = true;
}
