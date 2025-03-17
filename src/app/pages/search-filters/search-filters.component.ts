import { Component,  EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, debounceTime, map, Observable, switchMap } from 'rxjs';

import { GameService } from '../../services/game.service.js';
import { Game } from '../../model/game.model.js';
import { Tag } from '../../model/tag.model.js';
import { TagService } from '../../services/tag.service.js';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ViewGameComponent } from '../../components/view-game/view-game.component.js';
import { Platform } from '../../model/platform.model.js';
import { PlatformService } from '../../services/platform.service.js';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NULL } from 'sass';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [ FormsModule, NgIf, NgFor, MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      ReactiveFormsModule,
      MatButtonModule,
          MatInputModule,
          MatSelectModule,
      AsyncPipe, ViewGameComponent],
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.css'
})
export class SearchFiltersComponent {

  Games: Game[] = [];
  unfilteredData: Game[] | undefined ;
 

  tag: Tag | undefined;
  Tags: Tag[] | undefined;

  tags: Tag[] = []
   tagid!: number;
   i=0;
 
   options: string[] = [ ];
   filteredOptions: string[] = [];
   inputValue: string = '';
   showDropdown: boolean = false;
   hoveredOption: string | null = null;

   allGames: Game[] = [];
   filterGames: Game[] = [];
  choseTag!: Tag;
  filter: boolean = false;

  platformOptions: Platform[] = [];
  platformSelected: Platform[] = [];

  constructor(private gameService: GameService, private tagService: TagService, private platformService: PlatformService) {}


  showTags() {
    this.tagService.getAllTags()
    .subscribe(responseTags => this.tags = responseTags)
    }


 
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

  filter_options(option: string){
    this.tags.forEach((tag) => 
      {if(option===tag.name ){
        console.log("Hola")
        this.choseTag = tag;
      }})
      console.log(option);
      if(option !== '' && this.platformSelected.length !== 0){
        this.filterGames = this.Games.filter(game => 
        game.tags.some(tag => tag.name === this.choseTag.name)
        );
         this.filterGames = this.filterGames.filter(game => 
        game.platforms.some(platform => platform.name === this.platformSelected[0].name)
        
        );
        this.filter = true;
    
    }
    
    else if(option !== '' ){
       this.filterGames = this.Games.filter(game => 
        game.tags.some(tag => tag.name === this.choseTag.name)
       );}

    else if(this.platformSelected.length !== 0){
        this.filterGames = this.Games.filter(game => 
         game.platforms.some(platform => platform.name === this.platformSelected[0].name)
        
        );
        this.filter = true;
    }

    else{
        this.filter = false;
    }
      
      
   
    
  }



  myControl = new FormControl('');
    
  
  

  ngOnInit(){
    this.showTags();
    this.getGameDetails();
    this.platformService.getAllPlatforms().subscribe((responsePlatforms) => {
      this.platformOptions = responsePlatforms;
    });
  }


  getTagDetails() {
    this.tagService.getAllTags().subscribe((response) => {
      this.Tags = response;
    });
  }

  getGameDetails() {
    this.gameService.getAllGames().subscribe((response) => {
      this.Games = response;
    });
    
  }




}