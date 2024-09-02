import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformService, Platform } from '../../services/platform.service.js';
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
  
}
