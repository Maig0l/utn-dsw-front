import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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
    private formBuilder: FormBuilder,
    private gameService: GameService,
  ) {}

  // Autocomplete
  myControl = new FormControl('');
  options: Game[] = []; //stores all games from the search
  filteredOptions!: Observable<Game[]>;

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
  //----------------------------
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

  //----------------------------
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
      debounceTime(2000),
      switchMap((value) => this._filter(value || '')),
    );
  }
  //este es el que uso para crear
  playlistForm3 = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    isPrivate: new FormControl(false),
    owner: new FormControl(1), //TODO: Cambiar por User
  });

  addPlaylist() {
    console.log('ADD PLAYLIST ', this.playlistForm3.value, this.gameSelected);
    this.playlistService
      .addPlaylist(
        this.playlistForm3.value.name ?? '',
        this.playlistForm3.value.description ?? '',
        this.playlistForm3.value.isPrivate ?? false,
        this.user.id, // TODO cambiar por los datos del user bien puestos
        this.gameSelected.map((game) => game.id),
      )
      .subscribe((responsePlaylist) => {
        this.playlist = responsePlaylist;
        console.log('ADD PLAYLIST ', responsePlaylist);
      });
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

  //
  //
  //
  //
  //
  //
  // unused code

  // get gamesForm3(): FormArray {
  //   return this.playlistForm3.get('games') as FormArray;
  // }

  addGameInput(): void {
    this.games.push(new FormControl(''));
  }

  removeGameInput(index: number): void {
    this.games.removeAt(index);
  }

  playlistForm2 = this.formBuilder.group({
    name: [''],
    description: [''],
    isPrivate: [false],
    owner: [],
    games: this.formBuilder.array([this.formBuilder.control(0)]),
  });

  updateForm2 = this.formBuilder.group({
    id: [0],
    name: [''],
    description: [''],
    isPrivate: [false],
    owner: [],
    games: this.formBuilder.array([this.formBuilder.control(0)]),
  });

  get games(): FormArray {
    return this.playlistForm2.get('games') as FormArray;
  }

  addGames() {
    this.games.push(this.formBuilder.control(''));
  }

  playlistForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    isPrivate: new FormControl(false),
    owner: new FormControl(0),
    games: new FormControl(0),
  });

  deleteForm = new FormGroup({
    id: new FormControl(0),
  });

  updateForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    description: new FormControl(''),
    isPrivate: new FormControl(false),
    owner: new FormControl(0),
    games: new FormControl(0),
  });

  playlistIdForm = new FormGroup({
    id: new FormControl(0),
  });

  playlist: Playlist | undefined;
  playlists: Playlist[] | undefined;

  showPlaylists() {
    this.playlistService
      .getAllPlaylists()
      .subscribe((responsePlaylists) => (this.playlists = responsePlaylists));
  }

  updatePlaylist() {
    this.playlistService
      .updatePlaylist(
        this.updateForm.value.id ?? 0,
        this.updateForm.value.name ?? '',
        this.updateForm.value.description ?? '',
        this.updateForm.value.isPrivate ?? false,
        this.updateForm.value.owner ?? 0,
        this.updateForm.value.games ?? 0,
      )
      .subscribe((responsePlaylist) => (this.playlist = responsePlaylist));
  }

  deletePlaylist() {
    this.playlistService
      .deletePlaylist(this.deleteForm.value.id ?? 0)
      .subscribe((responsePlaylist) => (this.playlist = responsePlaylist));
  }

  getOnePlaylist() {
    this.playlistService
      .getOnePlaylist(this.playlistIdForm.value.id ?? 0)
      .subscribe((responsePlaylist) => (this.playlist = responsePlaylist));
  }

  editReady = false;

  populateForm() {
    const id = this.playlistIdForm.get('id')?.value;
    if (id) {
      this.playlistService.getOnePlaylist(id).subscribe((data: Playlist) => {
        this.updateForm.setValue({
          id: data.id,
          name: data.name,
          description: data.description,
          isPrivate: data.isPrivate,
          owner: data.owner,
          games: data.games,
        });
        this.editReady = true;
      }); //TODO handle error?
    } else {
      this.editReady = false;
    }
  }
}
