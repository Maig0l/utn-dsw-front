import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TagService, Tag } from '../services/tag.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [RouterOutlet,TagService],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {

    tagForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
    });

    deleteForm = new FormGroup({
      id: new FormControl(0)
    })

    updateForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      description: new FormControl('') 
    })

    tag: Tag | undefined
    tags: Tag[] | undefined

    constructor(private tagService: TagService) { }
  
  showTags() {
    this.tagService.getAllTags()
      .subscribe(responseTags => this.tags = responseTags)
  }
  
  addTag() {
    this.tagService.addTag(
      this.tagForm.value.name ?? "",
      this.tagForm.value.description ?? ""
    ).subscribe(responseTag => this.tag = responseTag)
  }

  updateTag() {
    this.tagService.updateTag(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.name ?? "",
      this.updateForm.value.description ?? ""
    )
    .subscribe(responseTag => this.tag = responseTag)
  }
  
  deleteTag() {
    this.tagService.deleteTag(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(res => console.log(res))
  }
}
