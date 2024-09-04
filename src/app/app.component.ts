import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { ShopService, Shop } from './components/services/shop.service.js';
import { PlatformComponent } from './components/platform/platform.component.js';
import { PlatformService } from './components/services/platform.service.js';
import { ShopComponent } from './components/shop/shop.component.js';
import { StudioComponent } from './components/studio/studio.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, PlatformComponent,ShopComponent, StudioComponent],
  // Registramos los servicios que nos traen los datos del backend
  //providers: [ShopService, PlatformService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
