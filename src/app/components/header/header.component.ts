import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { GameService } from '../../services/game.service';
import { Game } from '../../model/game.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [GameService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private gameService: GameService,
  ) {}

  myControl = new FormControl('');
  options: Game[] = [];
  filteredOptions!: Observable<Game[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      //filter(value => value !== ''), // Ignore initial empty value
      debounceTime(2000),
      //startWith(''),
      switchMap((value) => this._filter(value || '')),
    );
  }

  private _filter(value: string): Observable<Game[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Game[]>();
    }
    return this.gameService.findGamesByTitle(filterValue).pipe(
      map((data: Game[]) => {
        this.options = data;
        console.log(this.options);
        return this.options.filter((option) =>
          option.title.toLowerCase().includes(filterValue),
        );
      }),
    );
  }

  redirect(path: string) {
    this.router.navigate([path]); // Funcion para redirigir a una ruta
  }
}
