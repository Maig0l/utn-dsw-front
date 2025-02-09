import { Component } from '@angular/core';
import { Game, GameService } from '../services/game.service.js';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Review, ReviewService } from '../services/review.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet, GameService, ReviewService],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})

export class ReviewComponent {

  reviewForm = new FormGroup({

   
    score: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
    

  });

  gameId!: number;
  game!: Game;
  review!: Review;
  
  constructor( private route: ActivatedRoute, private gameService: GameService, private  reviewService: ReviewService, private router: Router ) {}
    
  ngOnInit() {
      // Obtén el ID del juego desde la URL
      this.gameId = +this.route.snapshot.paramMap.get('id')!
      // Usa el servicio para obtener los detalles del juego
      this.getGameDetails();
  }
  
  getGameDetails() {
      this.gameService.getOneGame(this.gameId).subscribe(response  => {
          this.game = response;
      });
  }

  addReview(){
    const score = Number.parseInt(this.reviewForm.value.score?.toString() ?? '0');
    
    this.reviewService.addReview(
      1, /*falta implementar usuario*/
      this.gameId,
      score,
      this.reviewForm.value.title ?? "",
      this.reviewForm.value.body ?? ""
    ).subscribe(responseReview => this.review = responseReview)
    ;this.router.navigate([`/game/${this.gameId}`]);
  }



}
