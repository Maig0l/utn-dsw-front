import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { TagService } from '../../services/tag.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Game } from '../../model/game.model';
import { Tag } from '../../model/tag.model';
import { Franchise } from '../../model/franchise.model';
import { Studio } from '../../model/studio.model';
import { Shop } from '../../model/shop.model';
import { Platform } from '../../model/platform.model';
import { FranchiseService } from '../../services/franchise.service';
import { PlatformService } from '../../services/platform.service';
import { ShopService } from '../../services/shop.service';
import { StudioService } from '../../services/studio.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  providers: [GameService, TagService, RouterOutlet],
  templateUrl: './edit-game.component.html',
  styleUrl: './edit-game.component.css',
})
export class EditGameComponent implements OnInit {
  updateForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(''),
    synopsis: new FormControl(''),
    releaseDate: new FormControl(''),
    portrait: new FormControl(''),
    banner: new FormControl(''),
  });

  id!: number;
  game!: Game;

  franchiseOptions: Franchise[] = [];
  franchiseSelected!: Franchise;
  tagOptions: Tag[] = [];
  tagSelected: Tag[] = [];
  studioOptions: Studio[] = [];
  studioSelected: Studio[] = [];
  shopOptions: Shop[] = [];
  shopSelected: Shop[] = [];
  platformOptions: Platform[] = [];
  platformSelected: Platform[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    private tagService: TagService,
    private franchiseService: FranchiseService,
    private platformService: PlatformService,
    private shopService: ShopService,
    private studioService: StudioService,
  ) {}

  ngOnInit() {
    console.log(this.shopSelected);
    // Get all options for the select fields
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

    // Get the game to update
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOneGame(this.id).subscribe((data: Game) => {
      console.log('Game: ', data);
      this.game = data;

      // Format date
      const date = new Date(data.releaseDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const formatedDate = `${year}-${month}-${day}`;

      this.tagSelected = data.tags;
      this.studioSelected = data.studios;
      this.shopSelected = data.shops;
      this.platformSelected = data.platforms;
      this.updateForm.setValue({
        id: data.id,
        title: data.title,
        synopsis: data.synopsis,
        releaseDate: formatedDate,
        portrait: data.portrait,
        banner: data.banner,
      });
    }); //TODO handle error?
  }

  updateGame() {
    console.log('GAME BEFORE UPDATE: ', this.game);
    const franchiseId = this.franchiseSelected ? this.franchiseSelected.id : 0;
    this.gameService
      .updateGame(
        this.id,
        this.updateForm.value.title ?? '',
        this.updateForm.value.synopsis ?? '',
        this.updateForm.value.releaseDate ?? '',
        this.updateForm.value.portrait ?? '',
        this.updateForm.value.banner ?? '',
        franchiseId ?? 0,
        this.tagSelected.map((tag) => tag.id),
        this.studioSelected.map((studio) => studio.id),
        this.shopSelected.map((shop) => shop.id),
        this.platformSelected.map((platform) => platform.id),
      )
      .subscribe((responseGame) => {
        this.game = responseGame;
        console.log('GAME AFTER UPDATE: ', responseGame);
      });
  }
}
