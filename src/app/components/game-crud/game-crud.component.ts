import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-crud',
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
  providers: [MatDialog, GameService],
  templateUrl: './game-crud.component.html',
  styleUrls: ['./game-crud.component.css'],
})
export class GameCrudComponent implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];
  paginatedGames: Game[] = [];
  displayedColumns: string[] = ['id', 'title', 'releaseDate', 'actions'];
  searchTerm = '';
  pageSize = 5;
  currentPage = 0;

  dialogForm: FormGroup;
  dialogMode: 'add' | 'edit' = 'add';
  currentGameId: number | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;
  @ViewChild('deleteDialogTemplate')
  deleteDialogTemplate!: TemplateRef<unknown>;

  gameIdToDelete: number | null = null;
  gameToDelete = '';

  constructor(
    private gameService: GameService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.dialogForm = new FormGroup({
      title: new FormControl(''),
      synopsis: new FormControl(''),
      releaseDate: new FormControl(''),
      portrait: new FormControl(''),
      banner: new FormControl(''),
      pictures: new FormControl(''),
      franchise: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe((games) => {
      this.games = games;
      this.filteredGames = games;
      this.updatePaginatedGames();
    });
  }

  filterGames(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredGames = this.games.filter(
      (game) =>
        game.title.toLowerCase().includes(term) ||
        (game.synopsis?.toLowerCase().includes(term) ?? false),
    );
    this.updatePaginatedGames();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedGames();
  }

  updatePaginatedGames(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGames = this.filteredGames.slice(startIndex, endIndex);
  }

  openAddDialog(): void {
    this.dialogMode = 'add';
    this.dialogForm.reset();
    this.dialog.open(this.dialogTemplate);
  }

  openEditDialog(game: Game): void {
    this.router.navigate(['/administradores/game/edit', game.id]);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveDialog(): void {
    const gameData = this.dialogForm.value;

    if (this.dialogMode === 'add') {
      // Usa addGameObj y pasa el objeto Game
      this.gameService
        .addGameObj({
          id: 0, // or undefined/null if your backend generates it
          title: gameData.title,
          synopsis: gameData.synopsis,
          releaseDate: gameData.releaseDate,
          portrait: gameData.portrait,
          banner: gameData.banner,
          pictures: gameData.pictures,
          franchise: gameData.franchise,
          tags: [],
          studios: [],
          shops: [],
          platforms: [],
          reviews: [],
          cumulativeRating: 0,
          reviewCount: 0,
        })
        .subscribe({
          next: (createdGame) => {
            this.loadGames();
            this.closeDialog();
            this.router.navigate(['/game', createdGame.id]);
          },
          error: (errorResponse) => {
            this.handleBackendError(errorResponse);
          },
        });
    } else if (this.dialogMode === 'edit' && this.currentGameId !== null) {
      // Usa updateGame y pasa los parámetros requeridos
      this.gameService
        .updateGame(
          this.currentGameId,
          gameData.title,
          gameData.synopsis,
          gameData.releaseDate,
          gameData.portrait,
          gameData.banner,
          gameData.franchise,
          [], // tags
          [], // studios
          [], // shops
          [], // platforms
        )
        .subscribe({
          next: () => {
            this.loadGames();
            this.closeDialog();
            this.router.navigate(['/edit-game', this.currentGameId]);
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
      if (errorMessage.toLowerCase().includes('title')) {
        this.dialogForm.get('title')?.setErrors({ backend: errorMessage });
      } else {
        alert('An unexpected error occurred: ' + errorMessage);
      }
    }
  }

  deleteGame(id: number): void {
    if (confirm('Are you sure you want to delete this game?')) {
      this.gameService.deleteGame(id).subscribe(() => {
        this.loadGames();
      });
    }
  }

  goToAddGame(): void {
    this.router.navigate(['/administradores/game/create']);
  }

  openDeleteDialog(id: number): void {
    this.gameIdToDelete = id;
    this.gameToDelete = this.games.find((f) => f.id === id)?.title || '';
    this.dialog.open(this.deleteDialogTemplate);
  }

  closeDeleteDialog(): void {
    this.dialog.closeAll();
    this.gameIdToDelete = null;
  }

  confirmDeleteGame(): void {
    if (this.gameIdToDelete !== null) {
      this.gameService.deleteGame(this.gameIdToDelete).subscribe(() => {
        this.loadGames();
        this.closeDeleteDialog();
      });
    }
  }
}
