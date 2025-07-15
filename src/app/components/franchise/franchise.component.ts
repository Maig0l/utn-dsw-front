import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FranchiseService } from '../../services/franchise.service';
import { GameService } from '../../services/game.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Franchise } from '../../model/franchise.model';
import { Game } from '../../model/game.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, debounceTime, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-franchise',
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
    MatAutocompleteModule,
    MatChipsModule,
  ],
  providers: [MatDialog, FranchiseService, GameService],
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.css'],
})
export class FranchiseComponent implements OnInit {
  franchises: Franchise[] = [];
  filteredFranchises: Franchise[] = [];
  paginatedFranchises: Franchise[] = [];
  displayedColumns: string[] = ['id', 'name', 'games', 'actions'];
  searchTerm = '';
  pageSize = 5;
  currentPage = 0;

  dialogForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  currentFranchiseId: number | null = null;

  // For games chips/autocomplete
  gameControl = new FormControl('');
  gameSelected: Game[] = [];
  filteredOptions!: Observable<Game[]>;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;
  @ViewChild('deleteDialogTemplate')
  deleteDialogTemplate!: TemplateRef<unknown>;

  franchiseIdToDelete: number | null = null;
  franchiseToDelete = '';

  constructor(
    private franchiseService: FranchiseService,
    private gameService: GameService,
    private dialog: MatDialog,
  ) {
    this.dialogForm = new FormGroup({
      name: new FormControl(''),
      games: new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.loadFranchises();

    this.filteredOptions = this.gameControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this._filterGames(value || '')),
    );
  }

  loadFranchises(): void {
    this.franchiseService.getAllFranchises().subscribe((franchises) => {
      this.franchises = franchises;
      this.filteredFranchises = franchises;
      this.updatePaginatedFranchises();
    });
  }

  filterFranchises(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredFranchises = this.franchises.filter(
      (franchise) =>
        franchise.name.toLowerCase().includes(term) ||
        franchise.games?.some((game) =>
          game.title.toLowerCase().includes(term),
        ),
    );
    this.updatePaginatedFranchises();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedFranchises();
  }

  updatePaginatedFranchises(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFranchises = this.filteredFranchises.slice(
      startIndex,
      endIndex,
    );
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.dialogForm.reset();
    this.gameSelected = [];
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(franchise: Franchise): void {
    this.dialogMode = 'edit';
    this.currentFranchiseId = franchise.id;
    this.dialogForm.setValue({
      name: franchise.name,
      games: franchise.games || [],
    });
    this.gameSelected = franchise.games ? [...franchise.games] : [];
    this.dialog.open(this.dialogTemplate);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveDialog(): void {
    const franchiseData = this.dialogForm.value;
    const gameIds = this.gameSelected.map((game) => game.id);

    if (this.dialogMode === 'add') {
      this.franchiseService
        .addFranchise(franchiseData.name, gameIds)
        .subscribe({
          next: () => {
            this.loadFranchises();
            this.closeDialog();
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
    } else if (this.dialogMode === 'edit' && this.currentFranchiseId !== null) {
      this.franchiseService
        .updateFranchise(this.currentFranchiseId, franchiseData.name, gameIds)
        .subscribe({
          next: () => {
            this.loadFranchises();
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
      } else if (errorMessage.toLowerCase().includes('game')) {
        this.dialogForm.get('games')?.setErrors({ backend: errorMessage });
      } else {
        alert('An unexpected error occurred: ' + errorMessage);
      }
    }
  }

  openDeleteDialog(id: number): void {
    this.franchiseIdToDelete = id;
    this.franchiseToDelete = this.franchises.find((f) => f.id === id)?.name || '';
    this.dialog.open(this.deleteDialogTemplate);
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
    this.franchiseIdToDelete = null;
  }

  confirmDeleteFranchise(): void {
    if (this.franchiseIdToDelete !== null) {
      this.franchiseService
        .deleteFranchise(this.franchiseIdToDelete)
        .subscribe(() => {
          this.loadFranchises();
          this.closeDeleteDialog();
        });
    }
  }

  // --- Game chips/autocomplete logic ---
  private _filterGames(value: string): Observable<Game[]> {
    const filterValue = value.toLowerCase();
    if (!filterValue) {
      return new Observable<Game[]>((observer) => observer.next([]));
    }
    return this.gameService
      .findGamesByTitle(filterValue)
      .pipe(
        map((games: Game[]) =>
          games.filter((option) =>
            option.title.toLowerCase().includes(filterValue),
          ),
        ),
      );
  }

  addGame(game: Game) {
    if (!this.gameSelected.some((g) => g.id === game.id)) {
      this.gameSelected.push(game);
    }
    this.gameControl.setValue('');
  }

  remove(game: Game): void {
    this.gameSelected = this.gameSelected.filter((g) => g.id !== game.id);
  }
}
