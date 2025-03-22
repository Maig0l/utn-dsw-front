import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Playlist, PlaylistService } from '../services/playlist.service';
import { GameService } from '../../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { Game } from '../../model/game.model';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-playlist-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  templateUrl: './playlist-edit.component.html',
  styleUrl: './playlist-edit.component.css',
})
export class PlaylistEditComponent {
  constructor(
    private playlistService: PlaylistService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

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
  id!: number;

  //este es el que uso para crear
  playlistForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    isPrivate: new FormControl(false),
    owner: new FormControl(1), //TODO: Cambiar por User
  });

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.playlistService.getOnePlaylist(this.id).subscribe((playlist) => {
      this.playlist = playlist;
      this.playlistForm.setValue({
        name: playlist.name,
        description: playlist.description,
        isPrivate: playlist.is_private,
        owner: playlist.owner,
      });
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._filter(value || '')),
    );
  }
  playlistUpdated = false;
  updatePlaylist() {
    this.playlistUpdated = false;
    this.playlistService
      .updatePlaylist(
        this.id,
        this.playlistForm.value.name ?? '',
        this.playlistForm.value.description ?? '',
        this.playlistForm.value.isPrivate ?? false,
        this.user.id, // TODO cambiar por los datos del user bien puestos
        this.gameSelected.map((game) => game.id),
      )
      .subscribe((responsePlaylist) => {
        this.playlist = responsePlaylist;
        this.playlistUpdated = true;
      });
  }
  goToPlaylist() {
    this.router.navigate(['/playlist', this.playlist.id]);
  }
  goToHomepage() {
    this.router.navigate(['/']);
  }
  addNewPlaylist() {
    this.playlistUpdated = false;
    this.playlistForm.reset();
    this.gameSelected = [];
  }
}
