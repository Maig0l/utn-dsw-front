import { Component } from '@angular/core';
import { Playlist, PlaylistService } from '../services/playlist.service.js';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Game } from '../services/game.service.js';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet,PlaylistService],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent {

  //playlistForm: FormGroup;


  constructor(private playlistService: PlaylistService){}
    
    /*, private fb: FormBuilder) {
    this.playlistForm = this.fb.group({
      name: new FormControl(''),
      description: new FormControl(''),
      is_private: new FormControl(false),
      owner: new FormControl(0),
      games: new FormArray([
        new FormControl(0)
      ])
    });
  }*/
  
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
    this.playlistService.getAllPlaylists()
    .subscribe(responsePlaylists => this.playlists = responsePlaylists)
  }
  
  addPlaylist() {
    this.playlistService.addPlaylist(
      this.playlistForm.value.name ?? "",
      this.playlistForm.value.description ?? "",
      this.playlistForm.value.is_private ?? false,
      this.playlistForm.value.owner ?? 0,
      this.playlistForm.value.games ?? 0
    ).subscribe(responsePlaylist => this.playlist = responsePlaylist)
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
