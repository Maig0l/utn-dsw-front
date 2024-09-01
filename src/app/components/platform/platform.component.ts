import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlatformService, Platform } from '../../services/platform.service.js';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [FormsModule],
  providers: [RouterOutlet,PlatformService],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css'
})
export class PlatformComponent {
    name: string = "";
    img: string = "";
    @Input() platform: Platform | undefined
    @Input() platforms: Platform[] | undefined
    constructor(private platformService: PlatformService) { }
  
  showPlatforms() {
    this.platformService.getAllPlatforms()
      .subscribe(responsePlatforms => this.platforms = responsePlatforms)
  }
  
  addPlatform(body: { name: string, img: string }) {
    this.platformService.addPlatform(body)
      .subscribe(responsePlatform => this.platform = responsePlatform)
  }
  
}
