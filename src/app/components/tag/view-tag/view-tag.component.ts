import { Component } from '@angular/core';
import { Tag, TagService } from '../../services/tag.service.js';
import { RouterOutlet } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule, MatGridTile} from '@angular/material/grid-list';
import { map, Observable, startWith } from 'rxjs';
import {AsyncPipe} from '@angular/common';

import { MatFormField } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-view-tag',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, DatePipe, ReactiveFormsModule, MatFormField,NgIf , NgFor, MatAutocompleteModule, MatInputModule, MatFormFieldModule, AsyncPipe],
  providers: [RouterOutlet,TagService, MatGridListModule, MatGridTile],
  templateUrl: './view-tag.component.html',
  styleUrl: './view-tag.component.css'
})
export class ViewTagComponent {

  options: string[] = [ ];
  filteredOptions: string[] = [];
  inputValue: string = '';
  showDropdown: boolean = false;
  hoveredOption: string | null = null;

  i=0;
  tag: Tag | undefined
  tags: Tag[] = []; 
 
  constructor(private tagService: TagService) { }
      


  showTags() {
    this.tagService.getAllTags()
    .subscribe(responseTags => this.tags = responseTags)
    }

  ngOnInit(): void {
      
      this.showTags();
      this.initOptions();
  }

  initOptions(){
    this.tags.forEach((tag) =>  this.options.push(tag.name));

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




/** 


  tagForm = new FormGroup({
        name: new FormControl('')
        });
  tag: Tag | undefined
  tags! : Tag[] 
 
  constructor(private tagService: TagService) { }
      


  showTags() {
    this.tagService.getAllTags()
    .subscribe(responseTags => this.tags = responseTags)
    }
    
  

    filteroptions!: Observable<string[]>
    formcontrol = new FormControl('');
  
    filteroptionslist!: Observable<Tag[]>
  
  
    ngOnInit(): void {
      
      this.showTags();
      this.filteroptionslist = this.formcontrol.valueChanges.pipe(
        startWith(''), map(value => this._LISTFILTER(value || ''))
      )
    }
  
   
  
    private _LISTFILTER(value: string): Tag[] {
      const searchvalue = value.toLocaleLowerCase();
      return this.tags.filter(option => option.name.toLocaleLowerCase().includes(searchvalue) || 
      option.name.toLocaleLowerCase().includes(searchvalue));
    }
  */
    /** viewTagsLike() {
      const name = this.tagForm.get('name')?.value;
      if (name) {
      const tags =  this.tagService.getAllTags()
      .subscribe(responseTags => this.tags = responseTags)
            } //TODO handle error?
       else {
          this.editReady = false;
      }
    }
    */

}
