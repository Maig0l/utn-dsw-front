import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Game, GameService } from '../../components/services/game.service';
import { Review, ReviewService } from '../../components/services/review.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet, GameService, ReviewService],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent {

  
  
    reviewForm = new FormGroup({

      score: new FormControl(0),
      title: new FormControl(''),
      body: new FormControl(''),
    });
  
    gameId!: number;
    game!: Game;
    review!: Review;
    editing!: boolean;


  constructor( private route: ActivatedRoute, private gameService: GameService, private  reviewService: ReviewService ) {}
    
  ngOnInit() {
    this.editing = false;
      // gets game ID from URL
      this.gameId = +this.route.snapshot.paramMap.get('id')!
      // Usa el servicio para obtener los detalles del juego
      this.getGameDetails();
  }

  getGameDetails() {
      this.gameService.getOneGame(this.gameId).subscribe(response  => {
          this.game = response;
      });
  }

}
