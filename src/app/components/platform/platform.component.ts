import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { PlatformService } from '../../services/platform.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Platform } from '../../model/platform.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-platform',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
  ],
  providers: [MatDialog, PlatformService],
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css'],
})
export class PlatformComponent implements OnInit {
  platforms: Platform[] = [];
  filteredPlatforms: Platform[] = [];
  paginatedPlatforms: Platform[] = [];
  displayedColumns: string[] = ['id', 'name', 'img', 'actions'];
  searchTerm = '';
  pageSize = 5;
  currentPage = 0;

  dialogForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  currentPlatformId: number | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;

  constructor(
    private platformService: PlatformService,
    private dialog: MatDialog,
  ) {
    this.dialogForm = new FormGroup({
      name: new FormControl(''),
      img: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadPlatforms();
  }

  loadPlatforms(): void {
    this.platformService.getAllPlatforms().subscribe((platforms) => {
      this.platforms = platforms;
      this.filteredPlatforms = platforms;
      this.updatePaginatedPlatforms();
    });
  }

  filterPlatforms(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPlatforms = this.platforms.filter(
      (platform) =>
        platform.name.toLowerCase().includes(term) ||
        platform.img.toLowerCase().includes(term),
    );
    this.updatePaginatedPlatforms();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedPlatforms();
  }

  updatePaginatedPlatforms(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPlatforms = this.filteredPlatforms.slice(
      startIndex,
      endIndex,
    );
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.dialogForm.reset();
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(platform: Platform): void {
    this.dialogMode = 'edit';
    this.currentPlatformId = platform.id;
    this.dialogForm.setValue({
      name: platform.name,
      img: platform.img,
    });
    this.dialog.open(this.dialogTemplate);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveDialog(): void {
    const platformData = this.dialogForm.value;

    if (this.dialogMode === 'add') {
      this.platformService
        .addPlatform(platformData.name, platformData.img)
        .subscribe({
          next: () => {
            this.loadPlatforms();
            this.closeDialog();
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
    } else if (this.dialogMode === 'edit' && this.currentPlatformId !== null) {
      this.platformService
        .updatePlatform(
          this.currentPlatformId,
          platformData.name,
          platformData.img,
        )
        .subscribe({
          next: () => {
            this.loadPlatforms();
            this.closeDialog();
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
    }
  }

  handleBackendError(errorResponse: { error: { message: string } }): void {
    console.error('Backend error response entera:', errorResponse);
    if (errorResponse.error && errorResponse.error.message) {
      const errorMessage = errorResponse.error.message[0];
      console.error('Backend error:', errorMessage);

      // Map specific error messages to form fields
      if (errorMessage.toLowerCase().includes('name')) {
        this.dialogForm.get('name')?.setErrors({ backend: errorMessage });
      } else if (errorMessage.toLowerCase().includes('img')) {
        this.dialogForm.get('img')?.setErrors({ backend: errorMessage });
      } else {
        alert('An unexpected error occurred: ' + errorMessage);
      }
    }
  }

  deletePlatform(id: number): void {
    if (confirm('Are you sure you want to delete this platform?')) {
      this.platformService.deletePlatform(id).subscribe(() => {
        this.loadPlatforms();
      });
    }
  }
}
