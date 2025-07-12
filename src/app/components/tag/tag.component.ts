import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tag } from '../../model/tag.model';
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
  selector: 'app-tag',
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
  providers: [MatDialog, TagService],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
})
export class TagComponent implements OnInit {
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  paginatedTags: Tag[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  searchTerm = '';
  pageSize = 5;
  currentPage = 0;

  dialogForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  currentTagId: number | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;
  @ViewChild('deleteDialogTemplate')
  deleteDialogTemplate!: TemplateRef<unknown>;

  tagIdToDelete: number | null = null;
  tagToDelete = '';

  constructor(
    private tagService: TagService,
    private dialog: MatDialog,
  ) {
    this.dialogForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe((tags) => {
      this.tags = tags;
      this.filteredTags = tags;
      this.updatePaginatedTags();
    });
  }

  filterTags(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTags = this.tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(term) ||
        (tag.description?.toLowerCase().includes(term) ?? false),
    );
    this.updatePaginatedTags();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedTags();
  }

  updatePaginatedTags(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTags = this.filteredTags.slice(startIndex, endIndex);
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.dialogForm.reset();
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(tag: Tag): void {
    this.dialogMode = 'edit';
    this.currentTagId = tag.id;
    this.dialogForm.setValue({
      name: tag.name,
      description: tag.description,
    });
    this.dialog.open(this.dialogTemplate);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveDialog(): void {
    const tagData = this.dialogForm.value;

    if (this.dialogMode === 'add') {
      this.tagService.addTag(tagData.name, tagData.description).subscribe({
        next: () => {
          this.loadTags();
          this.closeDialog();
        },
        error: (errorResponse) => {
          this.handleBackendError(errorResponse);
        },
      });
    } else if (this.dialogMode === 'edit' && this.currentTagId !== null) {
      this.tagService
        .updateTag(this.currentTagId, tagData.name, tagData.description)
        .subscribe({
          next: () => {
            this.loadTags();
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
      if (errorMessage.toLowerCase().includes('name')) {
        this.dialogForm.get('name')?.setErrors({ backend: errorMessage });
      } else if (errorMessage.toLowerCase().includes('description')) {
        this.dialogForm
          .get('description')
          ?.setErrors({ backend: errorMessage });
      } else {
        alert('An unexpected error occurred: ' + errorMessage);
      }
    }
  }

  openDeleteDialog(id: number): void {
    this.tagIdToDelete = id;
    this.tagToDelete = this.tags.find((f) => f.id === id)?.name || '';
    this.dialog.open(this.deleteDialogTemplate);
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
    this.tagIdToDelete = null;
  }

  confirmDeleteTag(): void {
    if (this.tagIdToDelete !== null) {
      this.tagService.deleteTag(this.tagIdToDelete).subscribe(() => {
        this.loadTags();
        this.closeDeleteDialog();
      });
    }
  }
}
