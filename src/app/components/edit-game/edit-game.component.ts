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
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { FranchiseComponent } from '../franchise/franchise.component.js';

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
  portraitFile: File | null = null;
  bannerFile: File | null = null;
  portraitPreview: string | null = null;
  bannerPreview: string | null = null;

  apiUrl = environment.apiUrl;

  //------------------------------
  // IMAGE UPLOAD
  onPortraitFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.portraitFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.portraitPreview = reader.result as string;
      };
      reader.readAsDataURL(this.portraitFile);
    }
  }

  onBannerFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.bannerFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.bannerPreview = reader.result as string;
      };
      reader.readAsDataURL(this.bannerFile);
    }
  }

  uploadImages() {
    if (this.portraitFile) {
      this.gameService.uploadPortrait(this.id, this.portraitFile).subscribe({
        next: () => {
          this.portraitFile = null;
        },
        error: (error) => console.error('Error uploading portrait:', error),
      });
    }

    if (this.bannerFile) {
      this.gameService.uploadBanner(this.id, this.bannerFile).subscribe({
        next: () => {
          this.bannerFile = null;
        },
        error: (error) => console.error('Error uploading banner:', error),
      });
    }
  }

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFranchise(_franchise: Franchise): void {
    this.isFrSelected = false;
    this.franchiseSelected = { id: 0, name: '', games: [] };
    this.franchiseControl.setValue(''); // Limpiar el campo de búsqueda
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
    // Get all tags
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

    // Get the game to update
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOneGame(this.id).subscribe((data: Game) => {
      this.game = data;

      // date formatting
      const dateParts = data.releaseDate.split('-');
      const date = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10),
      );
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = ('000' + date.getFullYear()).slice(-4);
      const formatedDate = `${year}-${month}-${day}`;
      this.franchiseSelected = data.franchise || { id: 0, name: '', games: [] };
      this.isFrSelected = data.franchise && data.franchise.id > 0;
      this.tagSelected = data.tags || [];
      this.studioSelected = data.studios || [];
      this.shopSelected = data.shops || [];
      this.platformSelected = data.platforms || [];
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

  gameUpdated = false;
  updateGame() {
    this.gameUpdated = false;

    this.gameService
      .updateGame(
        this.id,
        this.updateForm.value.title ?? '',
        this.updateForm.value.synopsis ?? '',
        this.updateForm.value.releaseDate ?? '',
        this.updateForm.value.portrait ?? '',
        this.updateForm.value.banner ?? '',
        this.franchiseSelected.id ?? 0,
        this.tagSelected.map((tag) => tag.id),
        this.studioSelected.map((studio) => studio.id),
        this.shopSelected.map((shop) => shop.id),
        this.platformSelected.map((platform) => platform.id),
      )
      .subscribe({
        next: (responseGame) => {
          this.game = responseGame;
          this.gameUpdated = true;
          this.uploadImages();
        },
        error: (error) => {
          console.error('Error updating game:', error);
        },
      });
  }
  goToGame() {
    this.router.navigate(['/game', this.id]);
  }
  goToHomepage() {
    this.router.navigate(['/']);
  }
}
