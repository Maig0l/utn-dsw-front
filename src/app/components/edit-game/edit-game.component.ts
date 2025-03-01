import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Tag, TagService } from '../../services/tag.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {Game} from "../../model/game.model";

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
  ],
  providers: [GameService, TagService, RouterOutlet],
  templateUrl: './edit-game.component.html',
  styleUrl: './edit-game.component.css',
})
export class EditGameComponent {
  id!: number;
  game!: Game;
  tag: Tag | undefined;
  gametags: Tag[] = [];
  pictures2: string[] = [];
  tags: Tag[] = [];
  tagid!: number;
  i = 0;
  //index = 0;

  options: string[] = [];
  filteredOptions: string[] = [];
  inputValue: string = '';
  showDropdown: boolean = false;
  hoveredOption: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    private tagService: TagService
  ) {}

  /*searchTags = new FormGroup({
    tagName: new FormControl('')
  })
  */
  updateForm = new FormGroup({
    id: new FormControl(0),
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

  showTags() {
    this;
  }

  ngOnInit() {
    this.tagService
      .getAllTags()
      .subscribe((responseTags) => (this.tags = responseTags));
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOneGame(this.id).subscribe((data: Game) => {
      const stringified = JSON.parse(JSON.stringify(data.pictures));

      const date = new Date(data.releaseDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const formatedDate = `${year}-${month}-${day}`;

      for (let i = 0; i < stringified.length; i++) {
        this.pictures2.push(stringified[i].url);
      }
      //this.index = this.pictures.length;
      this.gametags = data.tags;
      this.updateForm.setValue({
        id: data.id,
        title: data.title,
        synopsis: data.synopsis,
        releaseDate: formatedDate,
        portrait: data.portrait,
        banner: data.banner,
        pictures: data.pictures,
        franchise: data.franchise,
      });
    }); //TODO handle error?
  }

  //REVISAR
  /*getTagsLookupList(){
      this.tagService.getTagsByName(
        this.searchTags.value.tagName ?? "")
        .subscribe(response => this.tagsLookup = response)
    }
    */

  onInput(event: Event): void {
    if (this.i == 0) {
      this.tags.forEach((tag) => this.options.push(tag.name));
      this.i++;
    }
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.inputValue = value;
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(value)
    );
  }

  selectOption(option: string): void {
    this.inputValue = option;
    this.showDropdown = false;
  }

  onBlur(): void {
    // Delay hiding the dropdown to allow click events to register
    setTimeout(() => (this.showDropdown = false), 200);
  }

  //picture handling
  get pictures(): FormArray {
    return this.updateForm.get('pictures') as FormArray;
  }

  addPictureInput(): void {
    this.pictures.push(new FormControl(''));
  }

  removePictureInput(index: number): void {
    this.pictures.removeAt(index);
  }

  updateGame() {
    this.gameService
      .updateGame(
        this.id,
        this.updateForm.value.title ?? '',
        this.updateForm.value.synopsis ?? '',
        this.updateForm.value.releaseDate ?? '',
        this.updateForm.value.portrait ?? '',
        this.updateForm.value.banner ?? '',
        (this.updateForm.value.pictures ?? []).filter(
          (picture): picture is string => picture !== null
        ),
        this.updateForm.value.franchise ?? 0
      )
      .subscribe((responseGame) => {
        (this.game = responseGame), console.log(responseGame);
      });
  }

  deleteGame() {
    this.gameService
      .deleteGame(this.deleteForm.value.id ?? 0)
      .subscribe((res) => console.log(res));
  }

  addTag(option: string) {
    this.tags.forEach((tag) => {
      if (option === tag.name) {
        this.tagid = tag.id;
      }
    });
    this.gameService
      .addTagsToGame(this.id ?? 0, this.tagid ?? 0)
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
}
