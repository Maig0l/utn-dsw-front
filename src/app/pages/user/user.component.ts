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
//import { Game } from '../../model/game.model';
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
import {
  environment,
  linkToStaticResource,
} from '../../../enviroment/enviroment';
import { LoginService } from '../../services/auth/login.service';
import { ReviewService } from '../../services/review.service';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';

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
    ReviewCardComponent,
  ],
  providers: [UserService, TagService, PlaylistService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  goToPlaylist(id: number) {
    this.router.navigate(['/playlist', id]);
  }

  goToGame(gameId: number) {
    this.router.navigate(['/game', gameId]);
  }

  // TODO: Delete
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

  user: User | undefined;

  apiUrl = environment.apiUrl;

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private reviewService: ReviewService,
    private router: Router,
    private tagService: TagService,
    private playlistService: PlaylistService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    //let userDisplayedId: number;
    let userDisplayedNick: string;

    this.activatedRoute.params.subscribe({
      next: (params: Params) => {
        if (!params['nick']) {
          this.router.navigate(['/homepage']);
          return;
        }

        userDisplayedNick = params['nick'];

        this.userService
          .getUserByNick(userDisplayedNick)
          .subscribe((responseUser) => {
            this.user = responseUser;
            if (!this.user) {
              this.router.navigate(['/homepage']);
              return;
            }

            this.getReviews();
            this.getTagsByUser();
            this.getUserPlaylists(this.user.id);
          });
      },
    });
  }

  //showProfile(id: number) {}

  getReviews(): void {
    if (!this.user) throw Error("User didn't load in time");

    this.reviewService.getReviewsByAuthor(this.user).subscribe((value) => {
      this.reviews = value;
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

  goToEditProfile() {
    if (this.user) {
      this.router.navigate([`user/${this.user.id}/edit`]);
    }
  }

  expandedReviewId: number | null = null;

  closeReviewModal() {
    this.expandedReviewId = null;
  }

  handleExpandedChange(expanded: boolean) {
    if (!expanded) {
      this.expandedReviewId = null;
    }
  }
  // Add this method to your UserComponent class

  toggleReviewExpand(reviewId: number): void {
    if (this.expandedReviewId === reviewId) {
      this.expandedReviewId = null;
    } else {
      this.expandedReviewId = reviewId;
    }
  }

  expandedPlaylistId: number | null = null;

  togglePlaylistExpand(playlistId: number): void {
    if (this.expandedPlaylistId === playlistId) {
      this.expandedPlaylistId = null;
    } else {
      this.expandedPlaylistId = playlistId;
    }
  }

  protected readonly linkToStaticResource = linkToStaticResource;
}
