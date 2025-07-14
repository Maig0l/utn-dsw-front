import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GameService } from '../../services/game.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { Game } from '../../model/game.model';
import { environment } from '../../../enviroment/enviroment';

@Component({
  selector: 'app-view-game',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    DatePipe,
    RouterLink,
  ],
  providers: [RouterOutlet, GameService, MatGridListModule, MatGridTile],
  templateUrl: './view-game.component.html',
  styleUrl: './view-game.component.css',
})
export class ViewGameComponent {
  constructor(private gameService: GameService) {}

  @Input({ required: true }) game!: Game;

  apiUrl = environment.apiUrl;
}
