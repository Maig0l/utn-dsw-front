import { Component, OnInit, NgModule } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user.service';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TagService } from '../../services/tag.service.js';
import { Tag } from '../../model/tag.model';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/user.model.js';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    MatRippleModule,
    FormsModule,
  ],
  providers: [UserService, TagService],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  updateForm = new FormGroup({
    id: new FormControl(0),
    nick: new FormControl(''),
    profile_img: new FormControl(''),
    bio_text: new FormControl(''),
    linked_accounts: new FormArray<FormControl<string>>([]),
  });

  id!: number;
  user!: User;
  newAccount = '';
  showAccountInput = false;

  //-------------------------------
  //BETTER TAGS
  tagControl = new FormControl();
  tagOptions: Tag[] = [];
  tagSelected: Tag[] = [];
  filteredTagOptions!: Observable<Tag[]>;
  private _tagFilter(value: string): Observable<Tag[]> {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return new Observable<Tag[]>();
    }
    return this.tagService.getTagsByName(filterValue).pipe(
      map((data: Tag[]) => {
        this.tagOptions = data;

        return this.tagOptions.filter((option) =>
          option.name.toLowerCase().includes(filterValue),
        );
      }),
    );
  }
  addTag(tag: Tag) {
    if (this.tagSelected.includes(tag)) {
      return;
    }
    this.tagSelected.push(tag);
  }
  removeTag(tag: Tag): void {
    this.tagSelected.splice(this.tagSelected.indexOf(tag), 1);
  }
  //--------------------------------

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private tagService: TagService,
  ) {}

  ngOnInit() {
    this.filteredTagOptions = this.tagControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._tagFilter(value || '')),
    );

    //Get the current user id
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.id).subscribe((data: User) => {
      this.user = data;

      this.tagSelected = data.likedTags;

      this.updateForm.patchValue({
        id: data.id,
        nick: data.nick,
        profile_img: data.profile_img ?? '',
        bio_text: data.bio_text ?? '',
      });

      this.linkedAccounts.clear();

      (data.linked_accounts ?? []).forEach((account) => {
        //los parentesis de data.linked_accounts mas ?? hicieron magia
        this.linkedAccounts.push(
          new FormControl<string>(account ?? '', { nonNullable: true }),
        );
      });
    });
  }

  userUpdated = false;
  updateUser() {
    console.log('Updating user...', this.updateForm.value); // 🔍 Verifica los valores

    // Iterar por todos los controles del formulario linkedAccounts y guardar esos valores en un array

    const linked_accounts = this.updateForm.get('linked_accounts') as FormArray;
    const linked_accounts_array: string[] = [];
    for (let i = 0; i < linked_accounts.length; i++) {
      const control = linked_accounts.at(i) as FormControl;
      linked_accounts_array.push(control.value); // Save the control value into the array
    }
    this.userUpdated = true;
    this.userService
      .updateUser(
        this.id,
        this.updateForm.value.nick ?? '',
        this.updateForm.value.profile_img ?? '',
        this.updateForm.value.bio_text ?? '',
        linked_accounts_array, // Use the linkedAccountsArray here
        this.tagSelected.map((tag) => tag.id),
      )
      .subscribe((responseUser) => {
        this.user = responseUser;
        this.userUpdated = true;
        //  this.router.navigate(['/user/' + this.id]);
      });
  }

  get linkedAccounts() {
    return this.updateForm.get('linked_accounts') as FormArray<
      FormControl<string>
    >;
  }
  addLinkedAccount(): void {
    const linked_accounts = this.updateForm.get('linked_accounts') as FormArray;
    linked_accounts.push(new FormControl(''));
  }
  removeLinkedAccount(index: number) {
    const linked_accounts = this.updateForm.get('linked_accounts') as FormArray;
    linked_accounts.removeAt(index);
  }
  showAddAccountInput() {
    this.showAccountInput = true;
  }

  // Método para añadir la cuenta cuando se completa el input
  confirmNewAccount() {
    if (this.newAccount.trim()) {
      this.linkedAccounts.push(
        new FormControl(this.newAccount, { nonNullable: true }),
      );
      this.newAccount = '';
    }
    this.showAccountInput = false;
  }

  // Método para cancelar la adición
  cancelNewAccount() {
    this.newAccount = '';
    this.showAccountInput = false;
  }
}
