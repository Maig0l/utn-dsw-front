import { Component } from '@angular/core';
import { Game, GameService } from '../../components/services/game.service.js';
import { RouterOutlet } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule, MatGridTile} from '@angular/material/grid-list';



@Component({
  selector: 'app-view-game',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule],
  providers: [RouterOutlet,GameService, MatGridListModule, MatGridTile],
  templateUrl: './view-game.component.html',
  styleUrl: './view-game.component.css'
})
export class ViewGameComponent {
  game: Game | undefined

  games: Game[] | undefined

  constructor(private gameService: GameService) { }

  showGames() {
    this.gameService.getAllGames()
      .subscribe(responseGames => this.games = responseGames)
  }

  ngOnInit(): void {
    this.showGames();
  }
}
