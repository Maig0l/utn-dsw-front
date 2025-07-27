import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
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
import { Studio } from '../../model/studio.model';
import { StudioService } from '../../services/studio.service';
import { Franchise } from '../../model/franchise.model';
import { FranchiseService } from '../../services/franchise.service';
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
    this.tagControl.setValue(''); // Limpiar el input
    this.cdr.detectChanges(); // Forzar detección de cambios
  }
  removeTag(tag: Tag): void {
    this.tagSelected.splice(this.tagSelected.indexOf(tag), 1);
    this.cdr.detectChanges();
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
    this.platformControl.setValue(''); // Limpiar el input
    this.cdr.detectChanges(); // Forzar detección de cambios
  }
  removePlatform(platform: Platform): void {
    this.platformSelected.splice(this.platformSelected.indexOf(platform), 1);
    this.cdr.detectChanges();
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
    this.studioControl.setValue(''); // Limpiar el input
    this.cdr.detectChanges(); // Forzar detección de cambios
  }
  removeStudio(studio: Studio): void {
    this.studioSelected.splice(this.studioSelected.indexOf(studio), 1);
    this.cdr.detectChanges();
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
    this.franchiseControl.setValue(''); // Limpiar el input
    this.cdr.detectChanges(); // Forzar detección de cambios
  }
  removeFranchise(franchise: Franchise): void {
    this.franchiseSelected.splice(this.franchiseSelected.indexOf(franchise), 1);
    this.cdr.detectChanges();
  }
  //--------------------------------
  // DATE FILTER (from Angular Material)
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  readonly startDate = new Date(2016, 0, 1);
  readonly defaultDate = new Date(1970, 0, 1);
  //--------------------------------
  //STAR FILTER
  minStarValue = 0;
  maxStarValue = 5;

  filteredGames: Game[] = [];

  constructor(
    private gameService: GameService,
    private tagService: TagService,
    private franchiseService: FranchiseService,
    private platformService: PlatformService,
    private studioService: StudioService,
    private cdr: ChangeDetectorRef,
  ) {}

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
  }

  filterActivated = false;
  master_filter() {
    this.filterActivated = true;

    // Verificar si no hay filtros aplicados
    const hasFilters =
      this.tagSelected.length > 0 ||
      this.platformSelected.length > 0 ||
      this.studioSelected.length > 0 ||
      this.franchiseSelected.length > 0 ||
      this.range.value.start !== null ||
      this.range.value.end !== null ||
      this.minStarValue !== 0 ||
      this.maxStarValue !== 5;

    // Si no hay filtros, mostrar todos los juegos
    if (!hasFilters) {
      this.gameService.getAllGames().subscribe((response) => {
        this.filteredGames = response;
        this.cdr.detectChanges();
      });
      return;
    }

    this.gameService
      .filterGames(
        this.tagSelected.map((tag) => tag.id),
        this.platformSelected.map((platform) => platform.id),
        this.studioSelected.map((studio) => studio.id),
        this.franchiseSelected.map((franchise) => franchise.id),
        this.range.value.start ?? this.defaultDate,
        this.range.value.end ?? this.defaultDate,
        this.minStarValue,
        this.maxStarValue,
      )
      .subscribe((response) => {
        this.filteredGames = response;
        this.cdr.detectChanges();
      });
  }

  clearAllFilters() {
    // Limpiar todos los arrays de selección
    this.tagSelected = [];
    this.platformSelected = [];
    this.studioSelected = [];
    this.franchiseSelected = [];

    // Limpiar controles de formulario
    this.tagControl.setValue('');
    this.platformControl.setValue('');
    this.studioControl.setValue('');
    this.franchiseControl.setValue('');

    // Resetear rango de fechas
    this.range.reset();

    // Resetear valores de estrellas
    this.minStarValue = 0;
    this.maxStarValue = 5;

    // Limpiar resultados
    this.filterActivated = false;
    this.filteredGames = [];

    this.cdr.detectChanges();
  }
}
