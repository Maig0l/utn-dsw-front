import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { GameService } from '../../services/game.service';
import { Game } from '../../model/game.model';
import { Tag } from '../../model/tag.model';
import { TagService } from '../../services/tag.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { ViewGameComponent } from '../../components/view-game/view-game.component';
import { Platform } from '../../model/platform.model';
import { PlatformService } from '../../services/platform.service';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Studio } from '../../model/studio.model.js';
import { StudioService } from '../../services/studio.service.js';
import { Franchise } from '../../model/franchise.model.js';
import { FranchiseService } from '../../services/franchise.service.js';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    AsyncPipe,
    ViewGameComponent,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSliderModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.css',
})
export class SearchFiltersComponent implements OnInit {
  //-------------------------------
  //TAGS FILTER
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
  //PLATFORM FILTER
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
  //STUDIOS FILTER
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
  // FRANCHISE FILTER
  franchiseControl = new FormControl();
  franchiseOptions: Franchise[] = [];
  franchiseSelected: Franchise[] = [];
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
  addFranchise(franchise: Franchise) {
    if (this.franchiseSelected.includes(franchise)) {
      return;
    }
    this.franchiseSelected.push(franchise);
  }
  removeFranchise(franchise: Franchise): void {
    this.franchiseSelected.splice(this.franchiseSelected.indexOf(franchise), 1);
  }
  //--------------------------------
  // DATE FILTER (from Angular Material)
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  readonly startDate = new Date(2016, 0, 1);
  //--------------------------------
  //STAR FILTER
  minStarValue = 0;
  maxStarValue = 5;

  unfilteredData: Game[] | undefined;

  tag: Tag | undefined;
  Tags: Tag[] | undefined;

  tags: Tag[] = [];
  tagid!: number;
  i = 0;

  options: string[] = [];
  filteredOptions: string[] = [];
  inputValue = '';
  showDropdown = false;
  hoveredOption: string | null = null;

  allGames: Game[] = [];
  filteredGames: Game[] = [];
  choseTag!: Tag;
  filter = false;

  constructor(
    private gameService: GameService,
    private tagService: TagService,
    private franchiseService: FranchiseService,
    private platformService: PlatformService,
    private studioService: StudioService,
    private router: Router,
  ) {}

  filter_options(option: string) {
    this.tags.forEach((tag) => {
      if (option === tag.name) {
        console.log('Hola');
        this.choseTag = tag;
      }
    });
    console.log(option);
    if (option !== '' && this.platformSelected.length !== 0) {
      this.filteredGames = this.allGames.filter((game) =>
        game.tags.some((tag) => tag.name === this.choseTag.name),
      );
      this.filteredGames = this.filteredGames.filter((game) =>
        game.platforms.some(
          (platform) => platform.name === this.platformSelected[0].name,
        ),
      );
      this.filter = true;
    } else if (option !== '') {
      this.filteredGames = this.allGames.filter((game) =>
        game.tags.some((tag) => tag.name === this.choseTag.name),
      );
      this.filter = true;
    } else if (this.platformSelected.length !== 0) {
      this.filteredGames = this.allGames.filter((game) =>
        game.platforms.some(
          (platform) => platform.name === this.platformSelected[0].name,
        ),
      );
      this.filter = true;
    } else {
      this.filter = false;
    }
  }

  ngOnInit() {
    this.filteredTagOptions = this.tagControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._tagFilter(value || '')),
    );
    this.filteredPlatformOptions = this.platformControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._platformFilter(value || '')),
    );
    this.filteredStudioOptions = this.studioControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._studioFilter(value || '')),
    );
    this.filteredFranchiseOptions = this.franchiseControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._franchiseFilter(value || '')),
    );

    //TODO replace
    this.gameService.getAllGames().subscribe((response) => {
      this.allGames = response;
    });
  }
}
