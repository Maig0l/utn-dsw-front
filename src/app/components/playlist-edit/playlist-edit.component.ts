import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaylistService } from '../services/playlist.service';
import { Playlist } from '../../model/playlist.model';
import { GameService } from '../../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { Game } from '../../model/game.model';
import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth/login.service';

import { linkToStaticResource } from '../../../utils/linkToStaticResource';

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
export class PlaylistEditComponent implements OnInit {
  constructor(
    private playlistService: PlaylistService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
  ) {}

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
        // Filtrar juegos que ya están seleccionados
        const selectedGameIds = this.gameSelected.map((game) => game.id);
        return this.options.filter(
          (option) =>
            option.title.toLowerCase().includes(filterValue) &&
            !selectedGameIds.includes(option.id),
        );
      }),
    );
  }

  gameSelected: Game[] = [];
  addGame(game: Game) {
    // Verificar si el juego ya está seleccionado por ID
    if (this.gameSelected.some((selectedGame) => selectedGame.id === game.id)) {
      this.snackBar.open(
        `"${game.title}" is already in the playlist`,
        'Close',
        {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        },
      );
      return;
    }
    this.gameSelected.push(game);
    // Limpiar el input después de agregar un juego
    this.myControl.setValue('');
  }
  remove(game: Game): void {
    this.gameSelected.splice(this.gameSelected.indexOf(game), 1);
    // Refrescar las opciones del autocomplete para mostrar el juego removido
    const currentValue = this.myControl.value;
    if (currentValue && currentValue.trim() !== '') {
      this.myControl.updateValueAndValidity();
    }
  }

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
    // Verificar si el usuario está logueado
    if (!this.loginService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to edit playlists', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.router.navigate(['/log-in']);
      return;
    }

    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.playlistService.getOnePlaylist(this.id).subscribe({
      next: (playlist) => {
        this.playlist = playlist;

        // Verificar si el usuario actual es el propietario de la playlist
        const currentUser = this.loginService.currentUserData;
        if (currentUser.id !== playlist.owner) {
          this.snackBar.open(
            'You do not have permission to edit this playlist',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            },
          );
          this.router.navigate(['/user', currentUser.nick]);
          return;
        }

        // Popular el formulario con los datos de la playlist
        this.playlistForm.setValue({
          name: playlist.name,
          description: playlist.description,
          isPrivate: playlist.isPrivate,
          owner: playlist.owner,
        });

        // Cargar los juegos de la playlist en gameSelected
        if (playlist.games && playlist.games.length > 0) {
          this.gameSelected = [...playlist.games];
        }

        // Usar directamente los datos del usuario logueado
        this.user = this.loginService.currentUserData;
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
        this.snackBar.open('Error loading playlist', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['/homepage']);
      },
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
        this.loginService.currentUserData.id,
        this.gameSelected.map((game) => game.id),
      )
      .subscribe({
        next: (responsePlaylist) => {
          this.playlist = responsePlaylist;
          this.playlistUpdated = true;
          this.snackBar.open('Playlist updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        error: (error) => {
          console.error('Error updating playlist:', error);
          this.snackBar.open(
            `Error updating playlist: ${error.error?.message || 'Unknown error'}`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            },
          );
        },
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

  // Exponer la función para usar en el template
  protected readonly linkToStaticResource = linkToStaticResource;
}
