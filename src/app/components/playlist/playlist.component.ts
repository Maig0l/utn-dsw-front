import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Playlist } from '../../model/playlist.model';
import { Game } from '../../model/game.model';
import { User } from '../../model/user.model.js';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { GameService } from '../../services/game.service.js';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  providers: [RouterOutlet, PlaylistService, FormBuilder],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent implements OnInit {
  constructor(
    private playlistService: PlaylistService,
    private gameService: GameService,
    private router: Router,
  ) {}

  // Autocomplete
  myControl = new FormControl('');
  options: Game[] = []; //stores all games from the search
  filteredOptions!: Observable<Game[]>;

  playlist!: Playlist;

  private _filter(value: string): Observable<Game[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Game[]>();
    }
    return this.gameService.findGamesByTitle(filterValue).pipe(
      map((data: Game[]) => {
        this.options = data;
        console.log(this.options);
        return this.options.filter((option) =>
          option.title.toLowerCase().includes(filterValue),
        );
      }),
    );
  }

  gameSelected: Game[] = [];
  addGame(game: Game) {
    console.log('ADD GAME ', game);
    if (this.gameSelected.includes(game)) {
      return;
    }
    this.gameSelected.push(game);
  }
  remove(game: Game): void {
    this.gameSelected.splice(this.gameSelected.indexOf(game), 1);
    console.log(`Removed ${game.title}`);
  }

  //TODO: use the current user
  user: User = {
    id: 1,
    nick: 'Cienfuegos',
    email: 'cien@fuegos.com',
    profile_img: 'https://example.com/image.jpg',
    bio_text: 'Wi wi wi, uyaya, wu wu wi',
    linked_accounts: ['https://example.com/linked_account'],
  };

  userPlaylists: Playlist[] = [];

  ngOnInit(): void {
    this.getPlaylistsByOwner(this.user.id); //TODO remove

    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._filter(value || '')),
    );
  }
  //este es el que uso para crear
  playlistForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    isPrivate: new FormControl(false),
    owner: new FormControl(1), //TODO: Cambiar por User
  });

  playlistCreated = false;
  lastPlaylistId = 0;
  addPlaylist() {
    this.playlistCreated = false;
    this.playlistService
      .addPlaylist(
        this.playlistForm.value.name ?? '',
        this.playlistForm.value.description ?? '',
        this.playlistForm.value.isPrivate ?? false,
        this.user.id, // TODO cambiar por los datos del user bien puestos
        this.gameSelected.map((game) => game.id),
      )
      .subscribe((responsePlaylist) => {
        this.playlist = responsePlaylist;
        //TODO responsePlaylist tiene adentro el data, eso necesito
        console.log('ADDed PLAYLIST ', responsePlaylist);
        console.log('PLAYLIST ', responsePlaylist.id);
        this.playlistCreated = true;
        this.lastPlaylistId = responsePlaylist.id;
        console.log('PLAYLIST id ', this.lastPlaylistId);
      });
  }
  goToPlaylist() {
    console.log('GO TO PLAYLIST ', this.lastPlaylistId);
    this.router.navigate(['/playlist', this.lastPlaylistId]);
  }
  goToHomepage() {
    this.router.navigate(['/']);
  }
  addNewPlaylist() {
    this.playlistCreated = false;
    this.playlistForm.reset();
    this.gameSelected = [];
  }

  getPlaylistsByOwner(user: number) {
    console.log('GET PLAYLISTS BY OWNER ', user);
    //de algun lado sacar el usuario (acá o en el servicio)
    this.playlistService
      .getPlaylistsByOwner(user)
      .subscribe(
        (responsePlaylists) => (this.userPlaylists = responsePlaylists),
      );
    console.log('GET PLAYLISTS ', this.userPlaylists);
  }
}
