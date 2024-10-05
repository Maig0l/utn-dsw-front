import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameService, Game } from '../components/services/game.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet,GameService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

    
    gameForm = new FormGroup({
      title: new FormControl('')
    });

    deleteForm = new FormGroup({
      id: new FormControl(0)
    })

    updateForm = new FormGroup({
      //TODO
    })

    game: Game | undefined
    games: Game[] | undefined

    constructor(private gameService: GameService) { }
  
  showGames() {
    this.gameService.getAllGames()
      .subscribe(responseGames => this.games = responseGames)
  }

  addGame() {
    this.gameService.addGame(
      this.gameForm.value.title ?? ""
    ).subscribe(responseGame => this.game = responseGame)
  }

  /*updateGame() {
    this.gameService.updateGame(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.name ?? "",
      this.updateForm.value.img ?? ""
    )
    .subscribe(responseGame => this.game = responseGame)
  }
  */
  deleteGame() {
    this.gameService.deleteGame(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(res => console.log(res))
  }
}
