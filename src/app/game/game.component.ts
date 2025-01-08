import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameService, Game } from '../components/services/game.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tag, TagService } from '../components/services/tag.service.js';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet,GameService, TagService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

    
    gameForm = new FormGroup({
      title: new FormControl(''),
      synopsis: new FormControl(''),
      releaseDate: new FormControl(''),
      portrait: new FormControl(''),
      banner: new FormControl(''),
      pictures: new FormControl(''),
      franchise: new FormControl(0)
    });

    deleteForm = new FormGroup({
      id: new FormControl(0)
    })

    tagGames = new FormGroup({
      id: new FormControl(0),
      tag: new FormControl(0)
    })

    studiosGame = new FormGroup({
      id: new FormControl(0),
      studio: new FormControl(0)
    })

    shopsGame = new FormGroup({
      id: new FormControl(0),
      shop: new FormControl(0)
    })

    platformsGame = new FormGroup({
      id: new FormControl(0),
      platform: new FormControl(0)
    })

    updateForm = new FormGroup({
      id: new FormControl(0),
      title: new FormControl(''),
      synopsis: new FormControl(''),
      releaseDate: new FormControl(''),
      portrait: new FormControl(''),
      banner: new FormControl(''),
      pictures: new FormControl(''),
      franchise: new FormControl(0)
    })

    gameIdForm = new FormGroup({
      id: new FormControl(0)
    });

    game: Game | undefined
    games: Game[] | undefined
    tag: Tag | undefined

    constructor(private gameService: GameService, private tagService: TagService) { }
  
  showGames() {
    this.gameService.getAllGames()
      .subscribe(responseGames => this.games = responseGames)
  }

  

  addGame() {
    this.gameService.addGame(
      this.gameForm.value.title ?? "",
      this.gameForm.value.synopsis ?? "",
      this.gameForm.value.releaseDate ?? "", 
      this.gameForm.value.portrait ?? "",
      this.gameForm.value.banner ?? "",
      this.gameForm.value.pictures ?? "",
      this.gameForm.value.franchise ?? 0


    ).subscribe(responseGame => this.game = responseGame)
  }

  updateGame() {
    this.gameService.updateGame(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.title ?? "",
      this.updateForm.value.synopsis ?? "",
      this.updateForm.value.releaseDate ?? "",
      this.updateForm.value.portrait ?? "",
      this.updateForm.value.banner ?? "",
      this.updateForm.value.pictures ?? "",
      this.updateForm.value.franchise ?? 0
    )
    .subscribe(responseGame => this.game = responseGame)
  }

  
  

  deleteGame() {
    this.gameService.deleteGame(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(res => console.log(res))
  }
  editReady: boolean = false;

  addTagsToGame(){
    this.gameService.addTagsToGame(
      this.tagGames.value.id ?? 0,
      this.tagGames.value.tag ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

  addStudiosToGame(){
    this.gameService.addStudiosToGame(
      this.studiosGame.value.id ?? 0,
      this.studiosGame.value.studio ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

  addShopsToGame(){
    this.gameService.addShopsToGame(
      this.shopsGame.value.id ?? 0,
      this.shopsGame.value.shop ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

  addPlatformsToGame(){
    this.gameService.addPlatformsToGame(
      this.platformsGame.value.id ?? 0,
      this.platformsGame.value.platform ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

  populateForm() {
    const id = this.gameIdForm.get('id')?.value;
    if (id) {
      this.gameService.getOneGame(id).subscribe(
        (data: Game) => {
          this.updateForm.setValue({
            id: data.id,
            title: data.title,
            synopsis: data.synopsis,
            releaseDate: data.releaseDate,
            portrait: data.portrait,
            banner: data.banner,
            pictures: data.pictures,
            franchise: data.franchise         
          });
          this.editReady = true;
        }); //TODO handle error?
    } else {
      this.editReady = false;
    }
  }

}

