import { Component } from '@angular/core';
import { Tag, TagService } from '../../services/tag.service.js';
import { RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-view-tag',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, DatePipe],
  providers: [RouterOutlet,TagService, MatGridListModule, MatGridTile],
  templateUrl: './view-tag.component.html',
  styleUrl: './view-tag.component.css'
})
export class ViewTagComponent {



  tagForm = new FormGroup({
        name: new FormControl('')
        });
  tag: Tag | undefined
  tags: Tag[] | undefined
  constructor(private tagService: TagService) { }
      
    showTags() {
      this.tagService.getAllTags()
      .subscribe(responseTags => this.tags = responseTags)
      }

    ngOnInit(): void {
      this.showTags();
    }
    editReady: boolean = false;

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
