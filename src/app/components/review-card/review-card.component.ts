import { Component, Input, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Review } from '../../model/review.model';
import {
  environment,
  linkToStaticResource,
} from '../../../enviroment/enviroment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  review = input.required<Review>();
  apiUrl = environment.apiUrl;

  // Apagar para usar este componente en la página de perfil de usuario
  @Input() showProfilePicture = true;
  @Input() expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();
  protected readonly linkToStaticResource = linkToStaticResource;

  closeModal() {
    this.expandedChange.emit(false);
  }
}
