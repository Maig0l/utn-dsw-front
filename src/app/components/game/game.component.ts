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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FranchiseService } from '../../services/franchise.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Game } from '../../model/game.model';
import { Franchise } from '../../model/franchise.model';
import { Tag } from '../../model/tag.model';
import { StudioService } from '../../services/studio.service';
import { ShopService } from '../../services/shop.service';
import { PlatformService } from '../../services/platform.service';
import { Platform } from '../../model/platform.model';
import { Shop } from '../../model/shop.model';
import { Studio } from '../../model/studio.model';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../enviroment/enviroment.js';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  providers: [RouterOutlet, GameService, TagService, FranchiseService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  //------------------------------
  // IMAGE UPLOAD
  /*  onPortraitSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.gameService.uploadPortrait(this.lastGameId, file).subscribe({
      next: (response) => {
        const imagePath = response.path || response.url || response;
        this.gameForm.patchValue({ portrait: imagePath });
        console.log('Portrait subido. Path:', imagePath);
      },
      error: (err) => {
        console.error('Error al subir portrait:', err);
      },
    });
  }

  onBannerSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.gameService.uploadBanner(this.lastGameId, file).subscribe({
      next: (response) => {
        const imagePath = response.path || response.url || response;
        this.gameForm.patchValue({ banner: imagePath });
        console.log('Banner subido. Path:', imagePath);
      },
      error: (err) => {
        console.error('Error al subir banner:', err);
      },
    });
  }

  uploadImages() {
    if (this.portraitFile) {
      this.gameService.uploadPortrait(this.id, this.portraitFile).subscribe({
        next: () => {
          console.log('Portrait uploaded successfully');
          this.portraitFile = null;
        },
        error: (error) => console.error('Error uploading portrait:', error),
      });
    }

    if (this.bannerFile) {
      this.gameService.uploadBanner(this.id, this.bannerFile).subscribe({
        next: () => {
          console.log('Banner uploaded successfully');
          this.bannerFile = null;
        },
        error: (error) => console.error('Error uploading banner:', error),
      });
    }
  }
    */
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

        return this.tagOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addTag(tag: Tag) {
    if (this.tagSelected.includes(tag)) {
      return;
    }
    this.tagSelected.push(tag);
  }
  removeTag(tag: Tag): void {
    this.tagSelected.splice(this.tagSelected.indexOf(tag), 1);
  }
  //--------------------------------
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
        return this.studioOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addStudio(studio: Studio) {
    if (this.studioSelected.includes(studio)) {
      return;
    }
    this.studioSelected.push(studio);
  }
  removeStudio(studio: Studio): void {
    this.studioSelected.splice(this.studioSelected.indexOf(studio), 1);
  }
  //--------------------------------
  franchiseControl = new FormControl();
  franchiseOptions: Franchise[] = [];
  franchiseSelected: Franchise = { id: 0, name: '', games: [] };
  filteredFranchiseOptions!: Observable<Franchise[]>;
  private _franchiseFilter(value: string): Observable<Franchise[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Franchise[]>();
    }
    return this.franchiseService.getFranchisesByName(filterValue).pipe(
      map((data: Franchise[]) => {
        this.franchiseOptions = data;
        return this.franchiseOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  isFrSelected = false;
  addFranchise(franchise: Franchise) {
    if (this.franchiseSelected === franchise) {
      return;
    }
    this.franchiseSelected = franchise;
    this.isFrSelected = true;
  }
  removeFranchise(): void {
    this.isFrSelected = false;
    this.franchiseSelected = { id: 0, name: '', games: [] }; //TODO
  }
  //--------------------------------
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
        return this.shopOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addShop(shop: Shop) {
    if (this.shopSelected.includes(shop)) {
      return;
    }
    this.shopSelected.push(shop);
  }
  removeShop(shop: Shop): void {
    this.shopSelected.splice(this.shopSelected.indexOf(shop), 1);
  }
  //--------------------------------
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
        return this.platformOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addPlatform(platform: Platform) {
    if (this.platformSelected.includes(platform)) {
      return;
    }
    this.platformSelected.push(platform);
  }
  removePlatform(platform: Platform): void {
    this.platformSelected.splice(this.platformSelected.indexOf(platform), 1);
  }

  //--------------------------------

  gameForm = new FormGroup({
    title: new FormControl(''),
    synopsis: new FormControl(''),
    releaseDate: new FormControl(''),
    // URLs go in these controls
    portrait: new FormControl(''),
    banner: new FormControl(''),
    pictures: new FormArray([
      new FormControl(''), //REVISAR
    ]),
    tags: new FormControl<Tag[]>([]),
    studios: new FormControl<Studio[]>([]),
    platforms: new FormControl<Platform[]>([]),
    shops: new FormControl<Shop[]>([]),
  });

  id!: number;
  game: Game | undefined;
  portraitFile: File | null = null;
  bannerFile: File | null = null;
  portraitUrl!: string;
  bannerUrl!: string;

  apiUrl = environment.apiUrl;

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

  gameCreated = false;
  lastGameId = 0;
  addGame() {
    this.gameCreated = false;
    const x = this.gameForm.value as Game;

    this.gameService.addGameObj(x).subscribe((res) => {
      this.game = res;
      this.lastGameId = res.id;
      this.gameCreated = true;
    });

    /*
    this.gameService
      .addGame(
        this.gameForm.value.title ?? '',
        this.gameForm.value.synopsis ?? '',
        this.gameForm.value.releaseDate ?? '',
        this.gameForm.value.portrait ?? '',
        this.gameForm.value.banner ?? '',
        this.franchiseSelected.id ?? 0,
        this.tagSelected.map((tag) => tag.id),
        this.studioSelected.map((studio) => studio.id),
        this.shopSelected.map((shop) => shop.id),
        this.platformSelected.map((platform) => platform.id),
      )
      .subscribe((responseGame) => {
        this.game = responseGame;
        this.lastGameId = responseGame.id;
        this.gameCreated = true;
        //        this.uploadImages();
      });
*/
    //router.navigate(['/games']); TODO
  }
  goToGame() {
    this.router.navigate(['/game', this.lastGameId]);
  }
  goToHomepage() {
    this.router.navigate(['/']);
  }
  addNewGame() {
    this.gameForm.reset();
    this.gameCreated = false;
    this.tagSelected = [];
    this.studioSelected = [];
    this.franchiseSelected = { id: 0, name: '', games: [] };
    this.shopSelected = [];
    this.platformSelected = [];
  }
}
