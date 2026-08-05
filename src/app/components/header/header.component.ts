import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, of, switchMap } from 'rxjs';
import { GameService } from '../../services/game.service';
import { Game } from '../../model/game.model';
import { MatIcon } from '@angular/material/icon';

import { linkToStaticResource } from '../../../utils/linkToStaticResource';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NavComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIcon,
  ],
  providers: [GameService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) {}

  myControl = new FormControl('');
  options: Game[] = [];
  filteredOptions: Game[] = [];

  ngOnInit() {
    this.myControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((value) => this._filter(value || '')),
      )
      .subscribe((filtered) => {
        this.filteredOptions = filtered;
        this.cdr.detectChanges();
      });
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      this.options = [];
      return of([]);
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

  redirect(path: string) {
    this.router.navigate([path]); // Funcion para redirigir a una ruta
  }

  // Exponer la función para usar en el template
  protected readonly linkToStaticResource = linkToStaticResource;
}
