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
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, map, Observable, switchMap } from 'rxjs';

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
    MatChipsModule,
  ],
  providers: [RouterOutlet, GameService, TagService, FranchiseService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  //-------------------------------
  //BETTER TAGS
  tagControl = new FormControl();
  tagOptions: Tag[] = [];
  tagSelected: Tag[] = [];
  filteredTagOptions!: Observable<Tag[]>;
  private _tagFilter(value: string): Observable<Tag[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Tag[]>();
    }
    return this.tagService.getTagsByName(filterValue).pipe(
      map((data: Tag[]) => {
        this.tagOptions = data;
        console.log(this.tagOptions);
        return this.tagOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addTag(tag: Tag) {
    if (this.tagSelected.includes(tag)) {
      console.log('Tag already selected');
      return;
    }
    console.log('ADD TAG ', tag);
    this.tagSelected.push(tag);
  }
  removeTag(tag: Tag): void {
    this.tagSelected.splice(this.tagSelected.indexOf(tag), 1);
    console.log(`Removed ${tag.name}`);
  }
  //--------------------------------
  //BETTER STUDIOS
  studioControl = new FormControl();
  studioOptions: Studio[] = [];
  studioSelected: Studio[] = [];
  filteredStudioOptions!: Observable<Studio[]>;
  private _studioFilter(value: string): Observable<Studio[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Studio[]>();
    }
    return this.studioService.getStudiosByName(filterValue).pipe(
      map((data: Studio[]) => {
        this.studioOptions = data;
        console.log(this.studioOptions);
        return this.studioOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addStudio(studio: Studio) {
    if (this.studioSelected.includes(studio)) {
      console.log('Studio already selected');
      return;
    }
    console.log('ADD STUDIO ', studio);
    this.studioSelected.push(studio);
  }
  removeStudio(studio: Studio): void {
    this.studioSelected.splice(this.studioSelected.indexOf(studio), 1);
    console.log(`Removed ${studio.name}`);
  }
  //--------------------------------
  //BETTER FRANCHISES
  franchiseControl = new FormControl();
  franchiseOptions: Franchise[] = [];
  franchiseSelected!: Franchise;
  filteredFranchiseOptions!: Observable<Franchise[]>;
  private _franchiseFilter(value: string): Observable<Franchise[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Franchise[]>();
    }
    return this.franchiseService.getFranchisesByName(filterValue).pipe(
      map((data: Franchise[]) => {
        this.franchiseOptions = data;
        console.log(this.franchiseOptions);
        return this.franchiseOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  isFrSelected: boolean = false;
  addFranchise(franchise: Franchise) {
    if (this.franchiseSelected === franchise) {
      console.log('Franchise already selected');
      return;
    }
    console.log('ADD FRANCHISE ', franchise);
    this.franchiseSelected = franchise;
    this.isFrSelected = true;
  }
  removeFranchise(franchise: Franchise): void {
    this.isFrSelected = false;
    this.franchiseSelected = { id: 0, name: '', games: [] }; //TODO
    console.log(`Removed ${franchise.name}`);
  }
  //--------------------------------
  //BETTER SHOPS
  shopControl = new FormControl();
  shopOptions: Shop[] = [];
  shopSelected: Shop[] = [];
  filteredShopOptions!: Observable<Shop[]>;
  private _shopFilter(value: string): Observable<Shop[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Shop[]>();
    }
    return this.shopService.getShopsByName(filterValue).pipe(
      map((data: Shop[]) => {
        this.shopOptions = data;
        console.log(this.shopOptions);
        return this.shopOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addShop(shop: Shop) {
    if (this.shopSelected.includes(shop)) {
      console.log('Shop already selected');
      return;
    }
    console.log('ADD SHOP ', shop);
    this.shopSelected.push(shop);
  }
  removeShop(shop: Shop): void {
    this.shopSelected.splice(this.shopSelected.indexOf(shop), 1);
    console.log(`Removed ${shop.name}`);
  }
  //--------------------------------
  //BETTER PLATFORMS
  platformControl = new FormControl();
  platformOptions: Platform[] = [];
  platformSelected: Platform[] = [];
  filteredPlatformOptions!: Observable<Platform[]>;
  private _platformFilter(value: string): Observable<Platform[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Platform[]>();
    }
    return this.platformService.getPlatformsByName(filterValue).pipe(
      map((data: Platform[]) => {
        this.platformOptions = data;
        console.log(this.platformOptions);
        return this.platformOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addPlatform(platform: Platform) {
    if (this.platformSelected.includes(platform)) {
      console.log('Platform already selected');
      return;
    }
    console.log('ADD PLATFORM ', platform);
    this.platformSelected.push(platform);
  }
  removePlatform(platform: Platform): void {
    this.platformSelected.splice(this.platformSelected.indexOf(platform), 1);
    console.log(`Removed ${platform.name}`);
  }
  //--------------------------------

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

  constructor(
    private gameService: GameService,
    private tagService: TagService,
    private franchiseService: FranchiseService,
    private platformService: PlatformService,
    private shopService: ShopService,
    private studioService: StudioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.filteredTagOptions = this.tagControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._tagFilter(value || '')),
    );
    this.filteredStudioOptions = this.studioControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._studioFilter(value || '')),
    );
    this.filteredFranchiseOptions = this.franchiseControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._franchiseFilter(value || '')),
    );
    this.filteredShopOptions = this.shopControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._shopFilter(value || '')),
    );
    this.filteredPlatformOptions = this.platformControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._platformFilter(value || '')),
    );
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
        /*
        this.gameService
          .addPicturesToGame(
            this.game.id,
            (this.gameForm.value.pictures as (string | null)[]).filter(
              (picture): picture is string => picture !== null,
            ) ?? [],
          )
          .subscribe((responsePictures) => console.log(responsePictures));
          */
        console.log('GAME CREATED: ', responseGame);
      });
    //router.navigate(['/games']); TODO
  }
}
