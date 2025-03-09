import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { GameService } from '../../services/game.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TagService } from '../../services/tag.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FranchiseService } from '../../services/franchise.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Game } from '../../model/game.model';
import { Franchise } from '../../model/franchise.model';
import { Tag } from '../../model/tag.model';
import { MatRippleModule } from '@angular/material/core';
import { StudioService } from '../../services/studio.service';
import { ShopService } from '../../services/shop.service';
import { PlatformService } from '../../services/platform.service';
import { Platform } from '../../model/platform.model';
import { Shop } from '../../model/shop.model';
import { Studio } from '../../model/studio.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MatRippleModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  providers: [RouterOutlet, GameService, TagService, FranchiseService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  gameForm = new FormGroup({
    title: new FormControl(''),
    synopsis: new FormControl(''),
    releaseDate: new FormControl(''),
    portrait: new FormControl(''),
    banner: new FormControl(''),
    pictures: new FormArray([
      new FormControl(''), //REVISAR
    ]),
    franchise: new FormControl(0),
  }); // add tags, studios, shops, platforms?

  game: Game | undefined;
  franchiseOptions: Franchise[] = [];
  franchiseSelected: Franchise[] = [];
  tagOptions: Tag[] = [];
  tagSelected: Tag[] = [];
  studioOptions: Studio[] = [];
  studioSelected: Studio[] = [];
  shopOptions: Shop[] = [];
  shopSelected: Shop[] = [];
  platformOptions: Platform[] = [];
  platformSelected: Platform[] = [];

  constructor(
    private gameService: GameService,
    private tagService: TagService,
    private franchiseService: FranchiseService,
    private platformService: PlatformService,
    private shopService: ShopService,
    private studioService: StudioService,
    private router: Router,
  ) {}

  //get all franchises, tags, studios, shops, platforms. inneficient?
  ngOnInit(): void {
    this.franchiseService.getAllFranchises().subscribe((responseFranchises) => {
      this.franchiseOptions = responseFranchises;
    });
    this.tagService.getAllTags().subscribe((responseTags) => {
      this.tagOptions = responseTags;
    });
    this.studioService.getAllStudios().subscribe((responseStudios) => {
      this.studioOptions = responseStudios;
    });
    this.shopService.getAllShops().subscribe((responseShops) => {
      this.shopOptions = responseShops;
    });
    this.platformService.getAllPlatforms().subscribe((responsePlatforms) => {
      this.platformOptions = responsePlatforms;
    });
  }

  get pictures(): FormArray {
    return this.gameForm.get('pictures') as FormArray;
  }

  addPictureInput(): void {
    this.pictures.push(new FormControl(''));
  }

  removePictureInput(index: number): void {
    this.pictures.removeAt(index);
  }

  addGame() {
    console.log('PLATAFORMAS ELEGIDAS', this.platformSelected);
    this.gameService
      .addGame(
        this.gameForm.value.title ?? '',
        this.gameForm.value.synopsis ?? '',
        this.gameForm.value.releaseDate ?? '',
        this.gameForm.value.portrait ?? '',
        this.gameForm.value.banner ?? '',
        this.gameForm.value.franchise ?? 0,
        this.tagSelected.map((tag) => tag.id),
        this.studioSelected.map((studio) => studio.id),
        this.shopSelected.map((shop) => shop.id),
        this.platformSelected.map((platform) => platform.id),
      )
      .subscribe((responseGame) => {
        this.game = responseGame;

        this.gameService
          .addPicturesToGame(
            this.game.id,
            (this.gameForm.value.pictures as (string | null)[]).filter(
              (picture): picture is string => picture !== null,
            ) ?? [],
          )
          .subscribe((responsePictures) => console.log(responsePictures));
        console.log('GAME CREATED: ', responseGame);
      });
    //router.navigate(['/games']); TODO
  }
}
