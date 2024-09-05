import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { TagComponent } from './components/tag/tag.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, TagComponent],
  // Registramos los servicios que nos traen los datos del backend
  //providers: [ShopService, PlatformService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
