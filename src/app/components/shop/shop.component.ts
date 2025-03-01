import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {Shop} from "../../model/shop.model";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [RouterOutlet,ShopService],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  shopForm = new FormGroup({
    name: new FormControl(''),
    img: new FormControl(''),
    site: new FormControl('')
  })

  deleteForm = new FormGroup({
    id: new FormControl('')
  })

  shop: Shop | undefined
  shops: Shop[] | undefined

  constructor(private shopService: ShopService) { }

  // Esta función llama al getAllShops() del servicio de Shops (ShopService),
  //  que a su vez dispara la request HTTP
  showShops() {
      this.shopService.getAllShops()
        .subscribe(responseShops => this.shops = responseShops);
  }

  addShop() {
      this.shopService.addShop(
        this.shopForm.value.name ?? "",
        this.shopForm.value.img ?? "",
        this.shopForm.value.site ?? ""
      ).subscribe(responseShop => this.shop = responseShop);
  }

  deleteShop() {
    this.shopService.deleteShop(
      this.deleteForm.value.id ?? ""
    )
      .subscribe(res => console.log(res))
  }
}
