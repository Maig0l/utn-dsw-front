import { Component, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../model/tag.model';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../../model/user.model.js';
import { environment } from '../../../enviroment/enviroment';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-user-edit-succss-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Update Successful!</h2>
    <mat-dialog-content>
      User data updated correctly, returning to profile.
    </mat-dialog-content>
  `,
  styles: [
    `
      h2 {
        color: #4caf50;
      }
      mat-dialog-content {
        font-size: 16px;
      }
    `,
  ],
  imports: [MatDialogModule],
})
export class UserEditSuccessDialogComponent {}

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
    MatDialogModule,
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
  profileImgFile: File | null = null;
  profileImgPreview: string | null = null;
  newAccountControl = new FormControl('');

  apiUrl = environment.apiUrl;

  //------------------------------
  // IMAGE UPLOAD
  onProfileImgFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileImgFile = input.files[0];
      console.log('Profile picture file selected: ', this.profileImgFile);

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImgPreview = reader.result as string;
      };
      reader.readAsDataURL(this.profileImgFile);
    }
  }

  uploadImages() {
    if (this.profileImgFile && this.id) {
      const userToken = this.loginService.currentUserToken;
      this.userService
        .uploadProfileImg(userToken, this.id, this.profileImgFile)
        .subscribe({
          next: () => {
            console.log('Profile picture uploaded successfully');
            this.profileImgFile = null;
          },
          error: (error) =>
            console.error('Error uploading Profile picture:', error),
        });
    }
  }

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
    private dialog: MatDialog,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.filteredTagOptions = this.tagControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._tagFilter(value || '')),
    );

    let userDisplayedNick: string;

    this.route.params.subscribe({
      next: (params: Params) => {
        if (!params['nick']) {
          console.error('No user nick provided in route parameters');
          this.router.navigate(['/homepage']);
          return;
        }

        userDisplayedNick = params['nick'];

        this.userService
          .getUserByNick(userDisplayedNick)
          .subscribe((responseUser) => {
            console.log('User response:', responseUser); // ← Debug
            this.user = responseUser;
            if (!this.user) {
              this.router.navigate(['/homepage']);
              return;
            }

            // Popular el formulario con los datos del usuario
            this.populateForm();
            //this.getTagsByUser();
          });
      },
    });
  }

  // Método para popular el formulario
  populateForm() {
    // Llenar los campos básicos
    this.updateForm.patchValue({
      id: this.user.id,
      nick: this.user.nick,
      profile_img: this.user.profile_img ?? '',
      bio_text: this.user.bio_text ?? '',
    });

    // Limpiar linked_accounts antes de agregar los nuevos
    this.linkedAccounts.clear();

    // Agregar las cuentas vinculadas
    (this.user.linked_accounts ?? []).forEach((account: string) => {
      this.linkedAccounts.push(
        new FormControl<string>(account ?? '', { nonNullable: true }),
      );
    });

    // Cargar los tags seleccionados
    this.tagSelected = this.user.likedTags ?? [];

    console.log('Tags from user:', this.user.likedTags);
    console.log('Tags selected:', this.tagSelected);

    // Guardar el ID para usar en updateUser
    this.id = this.user.id;
  }

  likedTags!: Tag[];
  /*
  getTagsByUser() {
    this.tagService.getAllTags().subscribe((response) => {
      this.likedTags = response;
    });
  }
  */

  userUpdated = false;
  updateUser() {
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
        this.uploadImages();

        const dialogRef = this.dialog.open(UserEditSuccessDialogComponent);

        setTimeout(() => {
          dialogRef.close();
          this.router.navigate(['/user/' + this.updateForm.value.nick]);
        }, 2000);
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

  confirmNewAccount() {
    const value = this.newAccountControl.value?.trim();
    if (value) {
      this.linkedAccounts.push(
        new FormControl<string>(value, { nonNullable: true }),
      );
    }
    this.newAccountControl.reset();
    this.showAccountInput = false;
  }

  cancelNewAccount() {
    this.newAccountControl.reset();
    this.showAccountInput = false;
  }
}
