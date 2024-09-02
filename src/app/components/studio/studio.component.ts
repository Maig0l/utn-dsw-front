import {Component, Input} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {StudioService, Studio} from '../../services/studio.service.js';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [],
  providers: [RouterOutlet,StudioService],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css'
})
export class StudioComponent {
    @Input() studio: Studio | undefined
    @Input() studios: Studio[] | undefined
    constructor(private studioService: StudioService) { }
  
  showStudios() {
    this.studioService.getAllStudios()
      .subscribe(responseStudios => this.studios = responseStudios)
  }
  /*
  addStudio(studio: Studio) {
    this.studioService.addStudio(studio)
      .subscribe(responseStudio => this.studio = responseStudio)
  }
  */
}