import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Game, GameService } from '../../components/services/game.service';
import { Tag, TagService } from '../../components/services/tag.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [GameService, TagService, RouterOutlet],
  templateUrl: './edit-game.component.html',
  styleUrl: './edit-game.component.css'
})
export class EditGameComponent {
  
  id!: number
  game!: Game
  tag: Tag | undefined
  tags: Tag[] = []
  tagid!: number;
  i=0;

  options: string[] = [ ];
  filteredOptions: string[] = [];
  inputValue: string = '';
  showDropdown: boolean = false;
  hoveredOption: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute,private gameService: GameService, private tagService: TagService) { }
    
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
    pictures: new FormControl(''),
    franchise: new FormControl(0)
    })
    
  deleteForm = new FormGroup({
    id: new FormControl(0)
  })

  tagGames = new FormGroup({
    id: new FormControl(0),
    tag: new FormControl(0)
  })

  studiosGame = new FormGroup({
    id: new FormControl(0),
    studio: new FormControl(0)
  })

  shopsGame = new FormGroup({
    id: new FormControl(0),
    shop: new FormControl(0)
  })

  platformsGame = new FormGroup({
    id: new FormControl(0),
    platform: new FormControl(0)
  })

  showTags() {
    this.tagService.getAllTags()
    .subscribe(responseTags => this.tags = responseTags)
    }

  
  ngOnInit() {
    this.showTags();
    this.id = +this.route.snapshot.paramMap.get('id')!  
      this.gameService.getOneGame(this.id).subscribe(
        (data: Game) => {
          this.updateForm.setValue({
            id: data.id,
            title: data.title,
            synopsis: data.synopsis,
            releaseDate: data.releaseDate,
            portrait: data.portrait,
            banner: data.banner,
            pictures: data.pictures,
            franchise: data.franchise         
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
    if(this.i == 0)
    {    this.tags.forEach((tag) =>  this.options.push(tag.name));
         this.i ++;
    }
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.inputValue = value;
    this.filteredOptions = this.options.filter(option =>
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



    updateGame() {
    this.gameService.updateGame(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.title ?? "",
      this.updateForm.value.synopsis ?? "",
      this.updateForm.value.releaseDate ?? "",
      this.updateForm.value.portrait ?? "",
      this.updateForm.value.banner ?? "",
      this.updateForm.value.pictures ?? "",
      this.updateForm.value.franchise ?? 0
    )
    .subscribe(responseGame => this.game = responseGame)
  }

  deleteGame() {
    this.gameService.deleteGame(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(res => console.log(res))
  }

  addTag(option: string){
    this.tags.forEach((tag) => 
      {if(option===tag.name ){
      this.tagid =tag.id;
    }}
    )
    this.gameService.addTagsToGame(
      this.id ?? 0,
      this.tagid ?? 0
    ).subscribe(responseGame => this.game = responseGame)
  }

  addStudiosToGame(){
    this.gameService.addStudiosToGame(
      this.studiosGame.value.id ?? 0,
      this.studiosGame.value.studio ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

  addShopsToGame(){
    this.gameService.addShopsToGame(
      this.shopsGame.value.id ?? 0,
      this.shopsGame.value.shop ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

  addPlatformsToGame(){
    this.gameService.addPlatformsToGame(
      this.platformsGame.value.id ?? 0,
      this.platformsGame.value.platform ?? 0
    ).subscribe(responseGame => this.game = responseGame)

  }

}
