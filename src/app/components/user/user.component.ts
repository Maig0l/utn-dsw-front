import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { TagService } from '../../services/tag.service';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../model/playlist.model';
import { Tag } from '../../model/tag.model';
import { User } from '../../model/user.model';
import { Review } from '../../model/review.model';
import { Game } from '../../model/game.model';
import { HttpClientModule } from '@angular/common/http';
import { GameService } from '../../services/game.service';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { environment } from '../../../enviroment/enviroment.js';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRippleModule,
    MatChipsModule,
  ],
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

  playlists!: Playlist[];
  likedTags!: Tag[];
  reviews!: Review[];
  games: Game[] = [];

  user: User | undefined;

  apiUrl = environment.apiUrl;

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
    this.getTagsByUser();
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

  getUserPlaylists() {
    this.playlistService.getPlaylistsByOwner(1).subscribe((response) => {
      this.playlists = response;
    });
  }

  getTagsByUser() {
    this.tagService.getAllTags().subscribe((response) => {
      this.likedTags = response;
    });
  }

  goToEditProfile() {
    if (this.user) {
      this.router.navigate([`user/${this.user.id}/edit`]);
    }
  }
}
