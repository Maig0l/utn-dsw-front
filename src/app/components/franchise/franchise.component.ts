import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FranchiseService } from '../../services/franchise.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Franchise } from '../../model/franchise.model';
import { Game } from '../../model/game.model';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { GameService } from '../../services/game.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-franchise',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,  MatIconModule,
      MatDividerModule,
      MatFormFieldModule,
      MatButtonModule,
      MatInputModule,
      MatSelectModule,
      MatCheckboxModule,
      MatAutocompleteModule,
      MatChipsModule,],
  providers: [RouterOutlet, FranchiseService, GameService],
  templateUrl: './franchise.component.html',
  styleUrl: './franchise.component.css',
})
export class FranchiseComponent {
  franchiseForm = new FormGroup({
    name: new FormControl(''),
    games: new FormControl(), //TODO  must recieve an array of games
  });

  deleteForm = new FormGroup({
    id: new FormControl(0),
  });

  updateForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(''),
    //games: new FormControl() //TODO  must recieve an array of games
  });

  franchiseIdForm = new FormGroup({
    id: new FormControl(0),
  });

  franchise: Franchise | undefined;
  franchises: Franchise[] | undefined;

  myControl = new FormControl('');
  options: Game[] = []; //stores all games from the search
  filteredOptions!: Observable<Game[]>;

  constructor(
    private franchiseService: FranchiseService,
    private fb: FormBuilder,
    private gameService: GameService
  ) {}


  ngOnInit(): void {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        debounceTime(1500),
        switchMap((value) => this._filter(value || '')),
      );
    }

  showFranchises() {
    this.franchiseService
      .getAllFranchises()
      .subscribe(
        (responseFranchises) => (this.franchises = responseFranchises),
      );
  }

  addFranchise() {
    this.franchiseService
      .addFranchise(
        this.franchiseForm.value.name ?? '',
        this.gameSelected.map((game) => game.id), //TODO must recieve an array of games
      )
      .subscribe((responseFranchise) => (this.franchise = responseFranchise));
  }

  updateFranchise() {
    this.franchiseService
      .updateFranchise(
        this.updateForm.value.id ?? 0,
        this.updateForm.value.name ?? '',
        //this.updateForm.value.games ?? []
      )
      .subscribe((responseFranchise) => (this.franchise = responseFranchise));
  }

  deleteFranchise() {
    this.franchiseService
      .deleteFranchise(this.deleteForm.value.id ?? 0)
      .subscribe((res) => console.log(res));
  }

  editReady = false;

  populateForm() {
    const id = this.franchiseIdForm.get('id')?.value;
    if (id) {
      this.franchiseService.getOneFranchise(id).subscribe((data: Franchise) => {
        this.updateForm.setValue({
          id: data.id,
          name: data.name,
        });
        this.editReady = true;
      }); //TODO handle error?
    } else {
      this.editReady = false;
    }
  }


  private _filter(value: string): Observable<Game[]> {
      const filterValue = value.toLowerCase();
      if (filterValue === '') {
        return new Observable<Game[]>();
      }
      return this.gameService.findGamesByTitle(filterValue).pipe(
        map((data: Game[]) => {
          this.options = data;
          return this.options.filter((option) =>
            option.title.toLowerCase().includes(filterValue),
          );
        }),
      );
    }
  
    gameSelected: Game[] = [];
    addGame(game: Game) {
      if (this.gameSelected.includes(game)) {
        return;
      }
      this.gameSelected.push(game);
    }
    remove(game: Game): void {
      this.gameSelected.splice(this.gameSelected.indexOf(game), 1);
    }





}
