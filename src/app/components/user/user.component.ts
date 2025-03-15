import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service.js';
import { TagService } from '../../services/tag.service.js';
import { PlaylistService } from '../../services/playlist.service.js';
import { Playlist } from '../../model/playlist.model.js';
import { Tag } from '../../model/tag.model.js';
import { User } from '../../model/user.model.js';
import { Review } from '../../model/review.model.js';
import { Game} from '../../model/game.model.js';
import { HttpClientModule } from '@angular/common/http';
import { GameService } from '../../services/game.service.js';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [UserService, TagService, PlaylistService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  userForm = new FormGroup({
    nick: new FormGroup(''),
    email: new FormGroup(''),
    profile_img: new FormGroup(''),
    bio_text: new FormGroup(''),
    linked_accounts: new FormGroup(''),
  });

  playlist!: Playlist;
  likedTags!: Tag[];
  reviews!: Review[];
  games: Game[] = [];

  user : User | undefined;

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private tagService: TagService,
    private playlistService: PlaylistService,
  ) {}

  ngOnInit() {
    this.showProfile();
    this.getGameDetails();
  }

  showProfile() {
    this.userService
      .getUserById(1) // Hardcodeado hasta que el login funcione
      .subscribe((responseUser) => (this.user = responseUser));
  }

  getGameDetails() {
    this.gameService.getAllGames().subscribe((response) => {
      this.games = response;
    });

  }
}
