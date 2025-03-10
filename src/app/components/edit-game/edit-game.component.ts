import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
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
  //----------------------------------------------------------
  updateForm2 = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(''),
    synopsis: new FormControl(''),
    releaseDate: new FormControl(''),
    portrait: new FormControl(''),
    banner: new FormControl(''),
    /*pictures: new FormArray([
      new FormControl(''), //REVISAR
    ]),*/
    franchise: new FormControl(0),
  }); // add tags, studios, shops, platforms?

  //game: Game | undefined;
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

  //----------------------------------------------------------
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
  inputValue = '';
  showDropdown = false;
  hoveredOption: string | null = null;

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
    //--------------
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

    //---------------

    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOneGame(this.id).subscribe((data: Game) => {
      console.log(data);
      this.game = data;

      const date = new Date(data.releaseDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const formatedDate = `${year}-${month}-${day}`;

      /*const stringified = JSON.parse(JSON.stringify(data.pictures));
      for (const i of stringified.length) {
        this.pictures2.push(stringified[i].url);
      }*/
      //this.index = this.pictures.length;
      this.gametags = data.tags;
      this.updateForm2.setValue({
        id: data.id,
        title: data.title,
        synopsis: data.synopsis,
        releaseDate: formatedDate,
        portrait: data.portrait,
        banner: data.banner,
        //pictures: data.pictures,
        franchise: data.franchise,
      });
    }); //TODO handle error?
  }

  updateForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(''),
    synopsis: new FormControl(''),
    releaseDate: new FormControl(''),
    portrait: new FormControl(''),
    banner: new FormControl(''),
    /*pictures: new FormArray([
      new FormControl(''), //REVISAR
    ]),*/
    franchise: new FormControl(0),
  });

  updateGame() {
    this.gameService
      .updateGame(
        this.id,
        this.updateForm2.value.title ?? '',
        this.updateForm2.value.synopsis ?? '',
        this.updateForm2.value.releaseDate ?? '',
        this.updateForm2.value.portrait ?? '',
        this.updateForm2.value.banner ?? '',
        this.updateForm2.value.franchise ?? 0,
        //pictures
        this.tagSelected.map((tag) => tag.id),
        this.studioSelected.map((studio) => studio.id),
        this.shopSelected.map((shop) => shop.id),
        this.platformSelected.map((platform) => platform.id),
      )
      .subscribe((responseGame) => {
        this.game = responseGame;
        console.log('GAME UPDATED: ', responseGame);
      });
  }
  //REVISAR
  /*getTagsLookupList(){
      this.tagService.getTagsByName(
        this.searchTags.value.tagName ?? "")
        .subscribe(response => this.tagsLookup = response)
    }
    */
  /*
  onInput(event: Event): void {
    if (this.i == 0) {
      this.tags.forEach((tag) => this.options.push(tag.name));
      this.i++;
    }
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.inputValue = value;
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(value),
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

  /*picture handling
  get pictures(): FormArray {
    return this.updateForm.get('pictures') as FormArray;
  }

  addPictureInput(): void {
    this.pictures.push(new FormControl(''));
  }

  removePictureInput(index: number): void {
    this.pictures.removeAt(index);
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
  */
}
