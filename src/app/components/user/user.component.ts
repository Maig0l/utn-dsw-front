import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { LoginService } from '../../services/auth/login.service';

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
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    let userDisplayedId: number;

    this.activatedRoute.params.subscribe({
      next: (params: Params) => {
        if (params['id'] === 'me') {
          if (!this.loginService.isLoggedIn) {
            this.router.navigate(['/homepage']);
            return;
          }
          userDisplayedId = this.loginService.currentUserData.id;
        } else {
          if (!(params['id'] as number)) {
            this.router.navigate(['/homepage']);
            return;
          }

          userDisplayedId = params['id'];
        }

        this.userService
          .getUserById(userDisplayedId)
          .subscribe((responseUser) => {
            this.user = responseUser;
            if (!this.user) {
              this.router.navigate(['/homepage']);
              return;
            }

            this.getGameDetails();
            this.getTagsByUser();
          });
      },
    });
  }

  showProfile(id: number) {}

  getGameDetails() {
    this.gameService.getAllGames().subscribe((response) => {
      this.games = response;
    });
  }

  getUserPlaylists(id: number) {
    this.playlistService.getPlaylistsByOwner(id).subscribe((response) => {
      this.playlists = response;
    });
  }

  getTagsByUser() {
    this.tagService.getAllTags().subscribe((response) => {
      this.likedTags = response;
    });
  }

  goToEditProfile(id: number) {
    if (this.user) {
      this.router.navigate([`user/${this.user.id}/edit`]);
    }
  }
}
