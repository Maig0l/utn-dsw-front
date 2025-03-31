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
import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { GameService } from '../../services/game.service';
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
  providers: [RouterOutlet, PlaylistService, FormBuilder, UserService, GameService],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent implements OnInit {
  constructor(
    private playlistService: PlaylistService,
    private gameService: GameService,
    private router: Router,
    private userService: UserService,
  ) {}

  // Autocomplete
  myControl = new FormControl('');
  options: Game[] = []; //stores all games from the search
  filteredOptions!: Observable<Game[]>;

  playlist!: Playlist;
  user!: User;

  private _filter(value: string): Observable<Game[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Game[]>();
    }
    return this.gameService.findGamesByTitle(filterValue).pipe(
      map((data: Game[]) => {
        this.options = data;
        return this.options.filter((option) =>
          option.title.toLowerCase().includes(filterValue),
        );
      }),
    );
  }

  gameSelected: Game[] = [];
  addGame(game: Game) {
    if (this.gameSelected.includes(game)) {
      return;
    }
    this.gameSelected.push(game);
  }
  remove(game: Game): void {
    this.gameSelected.splice(this.gameSelected.indexOf(game), 1);
  }



  userPlaylists: Playlist[] = [];

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._filter(value || '')),
    );
    this.getUser();
  }
  //este es el que uso para crear
  playlistForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    isPrivate: new FormControl(false),
    owner: new FormControl(1), //TODO: Cambiar por User
  });

  playlistCreated = false;
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
        this.playlistCreated = true;
      });
  }
  goToPlaylist() {
    this.router.navigate(['/playlist', this.playlist.id]);
  }
  goToHomepage() {
    this.router.navigate(['/']);
  }
  addNewPlaylist() {
    this.playlistCreated = false;
    this.playlistForm.reset();
    this.gameSelected = [];
  }

  getUser() {
    this.userService.getUserById(1).subscribe((data : User) => { // recontra hardcodeado
      this.user = data;
  });
}
}
