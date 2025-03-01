import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  GameService,
  Game,
  Pictures,
} from '../../services/game.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tag, TagService } from '../../services/tag.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  Franchise,
  FranchiseService,
} from '../../services/franchise.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-game',
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
    MatAutocompleteModule,
  ],
  providers: [RouterOutlet, GameService, TagService, FranchiseService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
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
  });

  deleteForm = new FormGroup({
    id: new FormControl(0),
  });

  tagGames = new FormGroup({
    id: new FormControl(0),
    tag: new FormControl(0),
  });

  studiosGame = new FormGroup({
    id: new FormControl(0),
    studio: new FormControl(0),
  });

  shopsGame = new FormGroup({
    id: new FormControl(0),
    shop: new FormControl(0),
  });

  platformsGame = new FormGroup({
    id: new FormControl(0),
    platform: new FormControl(0),
  });

  gameIdForm = new FormGroup({
    id: new FormControl(0),
  });

  addPictureForm = new FormGroup({
    id: new FormControl(0),
    picture: new FormControl(''),
  });

  removePictureForm = new FormGroup({
    id: new FormControl(0),
    picture_id: new FormControl(''),
  });

  options: string[] = [];
  filteredOptions: string[] = [];
  inputValue: string = '';
  showDropdown: boolean = false;
  hoveredOption: string | null = null;

  i = 0;

  game: Game | undefined;
  games: Game[] = [];
  tag: Tag | undefined;
  franchises: Franchise[] = [];

  constructor(
    private gameService: GameService,
    private tagService: TagService,
    private franchiseService: FranchiseService,
    private router: Router
  ) {}

  frAutoc = new FormControl('');
  frOptions: Franchise[] = [];
  frFilteredOptions!: Observable<Franchise[]>;

  ngOnInit(): void {
    this.gameService
      .getAllGames()
      .subscribe((responseGames) => (this.games = responseGames));

    this.franchiseService.getAllFranchises().subscribe((responseFranchises) => {
      this.frOptions = responseFranchises;
    });

    this.frFilteredOptions = this.frAutoc.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filter(value || ''))
    );
  }

  private _filter(value2: string): Observable<Franchise[]> {
    const filterValue = value2.toLowerCase();
    if (filterValue === '') {
      return new Observable<Franchise[]>();
    }
    return of(
      this.frOptions.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      )
    );
  }

  selectFranchise($event: any): void {
    const frName = $event.option.value;
    const frId = this.frOptions.find((fr) => fr.name === frName)?.id;
    this.gameForm.patchValue({ franchise: frId });
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

  selectOption(option: string): void {
    this.inputValue = option;
    this.showDropdown = false;
  }

  onBlur(): void {
    // Delay hiding the dropdown to allow click events to register
    setTimeout(() => (this.showDropdown = false), 200);
  }

  addGame() {
    this.gameService
      .addGame(
        this.gameForm.value.title ?? '',
        this.gameForm.value.synopsis ?? '',
        this.gameForm.value.releaseDate ?? '',
        this.gameForm.value.portrait ?? '',
        this.gameForm.value.banner ?? '',
        this.gameForm.value.franchise ?? 0
      )
      .subscribe((responseGame) => {
        this.game = responseGame;
        this.gameService
          .addPicturesToGame(
            this.game.id,
            (this.gameForm.value.pictures as (string | null)[]).filter(
              (picture): picture is string => picture !== null
            ) ?? []
          )
          .subscribe((responsePictures) => console.log(responsePictures));
      });
  }

  deleteGame() {
    this.gameService
      .deleteGame(this.deleteForm.value.id ?? 0)
      .subscribe((res) => console.log(res));
  }
  editReady: boolean = false;

  addTagsToGame() {
    this.gameService
      .addTagsToGame(this.tagGames.value.id ?? 0, this.tagGames.value.tag ?? 0)
      .subscribe((responseGame) => (this.game = responseGame));
  }

  addStudiosToGame() {
    this.gameService
      .addStudiosToGame(
        this.studiosGame.value.id ?? 0,
        this.studiosGame.value.studio ?? 0
      )
      .subscribe((responseGame) => (this.game = responseGame));
  }

  addShopsToGame() {
    this.gameService
      .addShopsToGame(
        this.shopsGame.value.id ?? 0,
        this.shopsGame.value.shop ?? 0
      )
      .subscribe((responseGame) => (this.game = responseGame));
  }

  addPlatformsToGame() {
    this.gameService
      .addPlatformsToGame(
        this.platformsGame.value.id ?? 0,
        this.platformsGame.value.platform ?? 0
      )
      .subscribe((responseGame) => (this.game = responseGame));
  }
  /*
  populateForm() {
    const id = this.gameIdForm.get('id')?.value;
    if (id) {
      this.gameService.getOneGame(id).subscribe((data: Game) => {
        this.updateForm.setValue({
          id: data.id,
          title: data.title,
          synopsis: data.synopsis,
          releaseDate: data.releaseDate,
          portrait: data.portrait,
          banner: data.banner,
          pictures: data.pictures,
          franchise: data.franchise,
        });
        this.editReady = true;
      }); //TODO handle error?
    } else {
      this.editReady = false;
  }
}*/
  /* depricated?
onInput(event: Event): void {
  if (this.i == 0) {
    this.games.forEach((game) => this.options.push(game.title));
    this.i++;
  }
  const value = (event.target as HTMLInputElement).value.toLowerCase();
  this.inputValue = value;
  this.filteredOptions = this.options.filter((option) =>
  option.toLowerCase().includes(value)
);
}
*/
  /* depricated?
editGame(option: string) {
  this.games.forEach((game) => {
    if (option === game.title) {
      console.log(game.id);
      this.router.navigate(['edit-game', game.id]);
    }
  });
}
*/
  /* moved to edit-game.component.ts
updateGame() {
  this.gameService
  .updateGame(
    this.updateForm.value.id ?? 0,
    this.updateForm.value.title ?? '',
    this.updateForm.value.synopsis ?? '',
    this.updateForm.value.releaseDate ?? '',
    this.updateForm.value.portrait ?? '',
    this.updateForm.value.banner ?? '',
    (this.gameForm.value.pictures as (string | null)[]).filter(
      (picture): picture is string => picture !== null
    ) ?? [],
    this.updateForm.value.franchise ?? 0
  )
  .subscribe((responseGame) => (this.game = responseGame));
}
*/
  /* moved to edit-game.component.ts
updateForm = new FormGroup({
  id: new FormControl(0),
  title: new FormControl(''),
  synopsis: new FormControl(''),
  releaseDate: new FormControl(''),
  portrait: new FormControl(''),
  banner: new FormControl(''),
  pictures: new FormArray([new FormControl('')]),
  franchise: new FormControl(0),
});
*/
}
