import { Component, OnInit } from '@angular/core';
import { Playlist, PlaylistService } from '../../services/playlist.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Game } from '../../model/game.model'

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
  ],
  providers: [RouterOutlet, PlaylistService, FormBuilder],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  constructor(
    private playlistService: PlaylistService,
    private formBuilder: FormBuilder
  ) {}

  //#################################################
  ngOnInit(): void {
    this.getPlaylistsByOwner(this.user);
  }

  userPlaylists: Playlist[] = [];
  user: number = 1; //TODO: Cambiar por User

  getPlaylistsByOwner(user: number) {
    console.log('GET PLAYLISTS BY OWNER ', user);
    //de algun lado sacar el usuario (acá o en el servicio)
    this.playlistService
      .getPlaylistsByOwner(user)
      .subscribe(
        (responsePlaylists) => (this.userPlaylists = responsePlaylists)
      );
    console.log('GET PLAYLISTS ', this.userPlaylists);
  }

  //este es el que uso para crear
  playlistForm3 = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    is_private: new FormControl(false),
    owner: new FormControl(1), //TODO: Cambiar por User
    games: new FormArray([
      new FormControl(0), //REVISAR
    ]),
  });

  get gamesForm3(): FormArray {
    return this.playlistForm3.get('games') as FormArray;
  }

  addGameInput(): void {
    this.games.push(new FormControl(''));
  }

  removeGameInput(index: number): void {
    this.games.removeAt(index);
  }

  playlistForm2 = this.formBuilder.group({
    name: [''],
    description: [''],
    is_private: [false],
    owner: [],
    games: this.formBuilder.array([this.formBuilder.control(0)])
  });

  updateForm2 = this.formBuilder.group({
    id: [0],
    name: [''],
    description: [''],
    is_private: [false],
    owner: [],
    games: this.formBuilder.array([this.formBuilder.control(0)])
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
    is_private: new FormControl(false),
    owner: new FormControl(0),
    games: new FormControl(0)
  });

  deleteForm = new FormGroup({
    id: new FormControl(0)
  })

  updateForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    description: new FormControl(''),
    is_private: new FormControl(false),
    owner: new FormControl(0),
    games: new FormControl(0)
  })

  playlistIdForm = new FormGroup({
    id: new FormControl(0)
  });

  playlist: Playlist | undefined
  playlists: Playlist[] | undefined

  showPlaylists() {
    this.playlistService
      .getAllPlaylists()
      .subscribe((responsePlaylists) => (this.playlists = responsePlaylists));
  }

  addPlaylist() {
    console.log('ADD PLAYLIST ', this.playlistForm3.value);
    this.playlistService
      .addPlaylist(
        this.playlistForm3.value.name ?? '',
        this.playlistForm3.value.description ?? '',
        this.playlistForm3.value.is_private ?? false,
        this.user, //this.playlistForm3.value.owner ?? 0,
        (this.playlistForm3.get('games')?.value as (number | null)[]) //TODO: Cambiar por Game, no se si esta bien, a angular no le gusta
          .filter((game): game is number => game !== null) ?? [0]
      )
      .subscribe((responsePlaylist) => (this.playlist = responsePlaylist));
  }

  updatePlaylist() {
    this.playlistService.updatePlaylist(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.name ?? "",
      this.updateForm.value.description ?? "",
      this.updateForm.value.is_private ?? false,
      this.updateForm.value.owner ?? 0,
      this.updateForm.value.games ?? 0
    )
    .subscribe(responsePlaylist => this.playlist = responsePlaylist)
  }

  deletePlaylist() {
    this.playlistService.deletePlaylist(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(responsePlaylist => this.playlist = responsePlaylist)
  }

  getOnePlaylist() {
    this.playlistService.getOnePlaylist(
      this.playlistIdForm.value.id ?? 0
    )
    .subscribe(responsePlaylist => this.playlist = responsePlaylist)
  }

  editReady: boolean = false;

  populateForm() {
    const id = this.playlistIdForm.get('id')?.value;
    if (id) {
      this.playlistService.getOnePlaylist(id).subscribe(
        (data: Playlist) => {
          this.updateForm.setValue({
            id: data.id,
            name: data.name,
            description: data.description,
            is_private: data.is_private,
            owner: data.owner,
            games: data.games
          });
          this.editReady = true;
        }); //TODO handle error?
    } else {
      this.editReady = false;
    }
  }
}
