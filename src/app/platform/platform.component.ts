import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformService, Platform } from './platform.service.js';

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [],
  providers: [RouterOutlet,PlatformService],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css'
})
export class PlatformComponent {
    @Input() platforms: Platform[] | undefined
    constructor(private platformService: PlatformService) { }
  
  showPlatforms() {
    this.platformService.getAllPlatforms()
      .subscribe(responsePlatforms => this.platforms = responsePlatforms)
  }
}
