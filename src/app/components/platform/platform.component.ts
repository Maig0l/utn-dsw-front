import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformService, Platform } from '../../services/platform.service.js';

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [],
  providers: [RouterOutlet,PlatformService],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css'
})
export class PlatformComponent {
    @Input() platform: Platform | undefined
    @Input() platforms: Platform[] | undefined
    constructor(private platformService: PlatformService) { }
  
  showPlatforms() {
    this.platformService.getAllPlatforms()
      .subscribe(responsePlatforms => this.platforms = responsePlatforms)
  }
  /*
  addPlatform(platform: Platform) {
    this.platformService.addPlatform(platform)
      .subscribe(responsePlatform => this.platform = responsePlatform)
  }
  */
}
