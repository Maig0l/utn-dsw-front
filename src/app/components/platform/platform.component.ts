import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformService } from '../../services/platform.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Platform} from "../../model/platform.model";

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet,PlatformService],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css'
})
export class PlatformComponent {

    platformForm = new FormGroup({
      name: new FormControl(''),
      img: new FormControl('')
    });

    deleteForm = new FormGroup({
      id: new FormControl(0)
    })

    updateForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      img: new FormControl('')
    })

    platformIdForm = new FormGroup({
      id: new FormControl(0)
    });


    platform: Platform | undefined
    platforms: Platform[] | undefined

    constructor(private platformService: PlatformService) { }

    showPlatforms() {
      this.platformService.getAllPlatforms()
      .subscribe(responsePlatforms => this.platforms = responsePlatforms)
    }

    addPlatform() {
      this.platformService.addPlatform(
        this.platformForm.value.name ?? "",
        this.platformForm.value.img ?? ""
      ).subscribe(responsePlatform => this.platform = responsePlatform)
    }

    updatePlatform() {
      this.platformService.updatePlatform(
        this.updateForm.value.id ?? 0,
        this.updateForm.value.name ?? "",
        this.updateForm.value.img ?? ""
      )
      .subscribe(responsePlatform => this.platform = responsePlatform)
    }

    deletePlatform() {
      this.platformService.deletePlatform(
        this.deleteForm.value.id ?? 0
      )
      .subscribe(res => console.log(res))
    }

  editReady: boolean = false;

  populateForm() {
    const id = this.platformIdForm.get('id')?.value;
    if (id) {
      this.platformService.getOnePlatform(id).subscribe(
        (data: Platform) => {
          this.updateForm.setValue({
            id: data.id,
            name: data.name,
            img: data.img
          });
          this.editReady = true;
        }); //TODO handle error?
    } else {
      this.editReady = false;
    }
  }
}
