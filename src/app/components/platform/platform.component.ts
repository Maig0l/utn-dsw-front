import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformService, Platform } from '../services/platform.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [ReactiveFormsModule],
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
}
