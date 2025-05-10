import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Shop } from '../../model/shop.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule, // Add FormsModule here
    MatTableModule, // Add MatTableModule here
  ],
  providers: [MatDialog, RouterOutlet, ShopService],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  paginatedShops: Shop[] = [];
  displayedColumns: string[] = ['id', 'name', 'site', 'actions'];
  searchTerm = '';
  pageSize = 5;
  currentPage = 0;

  dialogForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  currentShopId: number | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;

  constructor(
    private shopService: ShopService,
    private dialog: MatDialog,
  ) {
    this.dialogForm = new FormGroup({
      name: new FormControl(''),
      img: new FormControl(''),
      site: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.shopService.getAllShops().subscribe((shops) => {
      this.shops = shops;
      this.filteredShops = shops;
      this.updatePaginatedShops();
    });
  }

  filterShops(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredShops = this.shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(term) ||
        shop.site.toLowerCase().includes(term),
    );
    this.updatePaginatedShops();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedShops();
  }

  updatePaginatedShops(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedShops = this.filteredShops.slice(startIndex, endIndex);
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.dialogForm.reset();
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(shop: Shop): void {
    this.dialogMode = 'edit';
    this.currentShopId = shop.id;
    this.dialogForm.setValue({
      name: shop.name,
      img: shop.img,
      site: shop.site,
    });
    this.dialog.open(this.dialogTemplate);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveDialog(): void {
    const shopData = this.dialogForm.value;
    if (this.dialogMode === 'add') {
      this.shopService
        .addShop(shopData.name, shopData.img, shopData.site)
        .subscribe(() => {
          this.loadShops();
          this.closeDialog();
        });
    } else if (this.dialogMode === 'edit' && this.currentShopId !== null) {
      this.shopService
        .updateShop(this.currentShopId, shopData)
        .subscribe(() => {
          this.loadShops();
          this.closeDialog();
        });
    }
  }

  deleteShop(id: number): void {
    if (confirm('Are you sure you want to delete this shop?')) {
      this.shopService.deleteShop(id).subscribe(() => {
        this.loadShops();
      });
    }
  }
}
