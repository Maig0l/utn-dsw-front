import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { StudioService } from '../../services/studio.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Studio } from '../../model/studio.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-studio',
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
    MatSelectModule,
  ],
  providers: [MatDialog, StudioService],
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css'],
})
export class StudioComponent implements OnInit {
  studios: Studio[] = [];
  filteredStudios: Studio[] = [];
  paginatedStudios: Studio[] = [];
  displayedColumns: string[] = ['id', 'name', 'type', 'site', 'actions'];
  searchTerm = '';
  pageSize = 5;
  currentPage = 0;

  dialogForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  currentStudioId: number | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;

  constructor(
    private studioService: StudioService,
    private dialog: MatDialog,
  ) {
    this.dialogForm = new FormGroup({
      name: new FormControl(''),
      type: new FormControl(''),
      site: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadStudios();
  }

  loadStudios(): void {
    this.studioService.getAllStudios().subscribe((studios) => {
      this.studios = studios;
      this.filteredStudios = studios;
      this.updatePaginatedStudios();
    });
  }

  filterStudios(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudios = this.studios.filter(
      (studio) =>
        studio.name.toLowerCase().includes(term) ||
        studio.site.toLowerCase().includes(term),
    );
    this.updatePaginatedStudios();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedStudios();
  }

  updatePaginatedStudios(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudios = this.filteredStudios.slice(startIndex, endIndex);
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.dialogForm.reset();
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(studio: Studio): void {
    this.dialogMode = 'edit';
    this.currentStudioId = studio.id;
    this.dialogForm.setValue({
      name: studio.name,
      type: studio.type,
      site: studio.site,
    });
    this.dialog.open(this.dialogTemplate);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveDialog(): void {
    const studioData = this.dialogForm.value;
    console.log('Studio Data:', studioData);
    if (this.dialogMode === 'add') {
      this.studioService
        .addStudio(studioData.name, studioData.type, studioData.site)
        .subscribe({
          next: () => {
            this.loadStudios();
            this.closeDialog();
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
    } else if (this.dialogMode === 'edit' && this.currentStudioId !== null) {
      this.studioService
        .updateStudio(this.currentStudioId, studioData)
        .subscribe({
          next: () => {
            this.loadStudios();
            this.closeDialog();
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
    }
  }

  handleBackendError(errorResponse: { error: { message: string } }): void {
    if (errorResponse.error && errorResponse.error.message) {
      const errorMessage = errorResponse.error.message;
      console.error('Backend error:', errorMessage);

      // Map specific error messages to form fields
      if (errorMessage.toLocaleLowerCase().includes('name')) {
        this.dialogForm.get('name')?.setErrors({ backend: errorMessage });
      } else if (errorMessage.toLocaleLowerCase().includes('site')) {
        this.dialogForm.get('site')?.setErrors({ backend: errorMessage });
      } else if (errorMessage.toLocaleLowerCase().includes('type')) {
        this.dialogForm.get('type')?.setErrors({ backend: errorMessage });
      } else {
        // Handle unexpected errors
        alert('An unexpected error occurred: ' + errorMessage);
      }
    }
  }

  deleteStudio(id: number): void {
    if (confirm('Are you sure you want to delete this studio?')) {
      this.studioService.deleteStudio(id).subscribe(() => {
        this.loadStudios();
      });
    }
  }
}
