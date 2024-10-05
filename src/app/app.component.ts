import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { ShopService, Shop } from './components/services/shop.service.js';
import { PlatformComponent } from './components/platform/platform.component.js';
import { PlatformService } from './components/services/platform.service.js';
import { ShopComponent } from './components/shop/shop.component.js';
import { StudioComponent } from './components/studio/studio.component.js';
import { HeaderComponent } from './shared/header/header.component.js';
import { FooterComponent } from './shared/footer/footer.component.js';
import { LoginComponent } from './auth/login/login.component.js';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TagComponent } from './components/tag/tag.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, LoginComponent, RouterOutlet, 
            NgFor, PlatformComponent,ShopComponent, StudioComponent, TagComponent,
            HeaderComponent, FooterComponent],
  // Registramos los servicios que nos traen los datos del backend
  //providers: [ShopService, PlatformService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
