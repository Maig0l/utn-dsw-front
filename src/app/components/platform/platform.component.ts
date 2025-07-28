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
import { linkToStaticResource } from '../../../enviroment/enviroment';

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
  @ViewChild('deleteDialogTemplate')
  deleteDialogTemplate!: TemplateRef<unknown>;

  platformIdToDelete: number | null = null;
  platformToDelete = '';

  // Propiedades para manejo de imágenes
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Función para manejar recursos estáticos
  protected readonly linkToStaticResource = linkToStaticResource;

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
    this.selectedFile = null;
    this.imagePreview = null;
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(platform: Platform): void {
    this.dialogMode = 'edit';
    this.currentPlatformId = platform.id;
    this.dialogForm.setValue({
      name: platform.name,
      img: platform.img,
    });
    this.selectedFile = null;
    this.imagePreview = platform.img
      ? this.linkToStaticResource(platform.img)
      : null; // Mostrar imagen actual con URL completa
    this.dialog.open(this.dialogTemplate);
  }

  // Abre el diálogo de borrado
  openDeleteDialog(id: number): void {
    this.platformIdToDelete = id;
    this.platformToDelete = this.platforms.find((f) => f.id === id)?.name || '';
    this.dialog.open(this.deleteDialogTemplate);
  }

  // Cierra el diálogo de borrado
  closeDeleteDialog(): void {
    this.dialog.closeAll();
    this.platformIdToDelete = null;
  }

  // Confirma el borrado
  confirmDeletePlatform(): void {
    if (this.platformIdToDelete !== null) {
      this.platformService
        .deletePlatform(this.platformIdToDelete)
        .subscribe(() => {
          this.loadPlatforms();
          this.closeDeleteDialog();
        });
    }
  }

  closeDialog(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.dialog.closeAll();
  }

  // Método para manejar selección de archivo de imagen
  onImageFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveDialog(): void {
    const platformData = this.dialogForm.value;

    if (this.dialogMode === 'add') {
      if (this.selectedFile) {
        // Si hay archivo seleccionado, crear plataforma primero y luego subir imagen
        this.platformService.addPlatform(platformData.name).subscribe({
          next: (platform) => {
            // Subir la imagen después de crear la plataforma
            this.platformService
              .uploadImage(platform.id, this.selectedFile!)
              .subscribe({
                next: () => {
                  this.loadPlatforms();
                  this.closeDialog();
                },
                error: (errorResponse) => {
                  this.handleBackendError(errorResponse);
                },
              });
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
      } else {
        // Si no hay archivo, crear plataforma sin imagen
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
      }
    } else if (this.dialogMode === 'edit' && this.currentPlatformId !== null) {
      if (this.selectedFile) {
        // Si hay nuevo archivo, subir imagen primero
        this.platformService
          .uploadImage(this.currentPlatformId, this.selectedFile)
          .subscribe({
            next: (response) => {
              // Actualizar la plataforma con la nueva URL de imagen
              this.platformService
                .updatePlatform(
                  this.currentPlatformId!,
                  platformData.name,
                  response.img,
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
            },
            error: (errorResponse) => {
              this.handleBackendError(errorResponse);
            },
          });
      } else {
        // Si no hay nuevo archivo, actualizar solo los datos
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
  }

  handleBackendError(errorResponse: { error?: { message?: unknown } }): void {
    console.error('Backend error response:', errorResponse);

    if (errorResponse.error && errorResponse.error.message) {
      let errorMessage = errorResponse.error.message;

      // Si es un array, tomar el primer elemento
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage[0];
      }

      console.error('Backend error:', errorMessage);

      // Si es un objeto de validación, extraer el mensaje
      if (
        typeof errorMessage === 'object' &&
        errorMessage &&
        'message' in errorMessage
      ) {
        errorMessage = (errorMessage as { message: string }).message;
      }

      // Convertir a string si no lo es
      const errorString =
        typeof errorMessage === 'string'
          ? errorMessage
          : JSON.stringify(errorMessage);

      // Map specific error messages to form fields
      if (errorString.toLowerCase().includes('name')) {
        this.dialogForm.get('name')?.setErrors({ backend: errorString });
      } else if (
        errorString.toLowerCase().includes('img') ||
        errorString.toLowerCase().includes('url')
      ) {
        this.dialogForm.get('img')?.setErrors({ backend: errorString });
      } else {
        alert('An unexpected error occurred: ' + errorString);
      }
    } else {
      alert('An unexpected error occurred');
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
