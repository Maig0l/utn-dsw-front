import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { ShopService, Shop } from './shop.service.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor],
  // Registramos los servicios que nos traen los datos del backend
  providers: [ShopService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  shops: Shop[] | undefined
  constructor(private shopService: ShopService) { }

  // Esta función llama al getAllShops() del servicio de Shops (ShopService),
  //  que a su vez dispara la request HTTP
  showShops() {
    this.shopService.getAllShops()
      .subscribe(responseShops => this.shops = responseShops)
  }
}
