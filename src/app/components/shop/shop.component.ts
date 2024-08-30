import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShopService, Shop } from '../../services/shop.service.js';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [],
  providers: [RouterOutlet,ShopService],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  shops: Shop[] | undefined
  constructor(private shopService: ShopService) { }

  // Esta función llama al getAllShops() del servicio de Shops (ShopService),
  //  que a su vez dispara la request HTTP
  showShops() {
    this.shopService.getAllShops()
      .subscribe(responseShops => this.shops = responseShops)
  }
}
