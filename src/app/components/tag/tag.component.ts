import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TagService, Tag } from '../../services/tag.service';
import { Game } from '../../services/game.service';



@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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

    tagIdForm = new FormGroup({
      id: new FormControl(0)
    });


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

  editReady: boolean = false;

  populateForm() {
    const id = this.tagIdForm.get('id')?.value;
    if (id) {
      this.tagService.getOneTag(id).subscribe(
        (data: Tag) => {
          this.updateForm.setValue({
            id: data.id,
            name: data.name,
            description: data.description
          });
          this.editReady = true;
        }); //TODO handle error?
    } else {
      this.editReady = false;
    }
  }
}
