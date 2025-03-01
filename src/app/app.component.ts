import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { ShopService } from './services/shop.service';
import { PlatformComponent } from './components/platform/platform.component.js';
import { PlatformService } from './services/platform.service';
import { ShopComponent } from './components/shop/shop.component.js';
import { StudioComponent } from './components/studio/studio.component.js';
import { HeaderComponent } from './components/header/header.component.js';
import { FooterComponent } from './components/footer/footer.component.js';
import { LoginComponent } from "./components/login/login.component";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Shop} from "./model/shop.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
