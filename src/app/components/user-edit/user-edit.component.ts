import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
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
    imports: [    ReactiveFormsModule,
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

  ngOnInit(){
        this.filteredTagOptions = this.tagControl.valueChanges.pipe(
      debounceTime(1500),
      switchMap((value) => this._tagFilter(value || '')),
    );

    //Get the current user id
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.id).subscribe((data : User) => {
      this.user = data;

      this.tagSelected = data.likedTags;
      this.updateForm.setValue({
        id: data.id,
        nick: data.nick,
        profile_img: data.profile_img ?? '',
        bio_text: data.bio_text ?? '',
        linked_accounts: data.linked_accounts || [],
      });
  })
  }

  userUpdated = false;
  updateUser() {
    this.userUpdated = true;
    this.userService
      .updateUser(
        this.id,
        this.updateForm.value.nick ?? '',
        this.updateForm.value.profile_img ?? '',
        this.updateForm.value.bio_text ?? '',
        this.updateForm.value.linked_accounts ?? [],
        this.tagSelected.map((tag) => tag.id),
      )
      .subscribe((responseUser) => {
        this.user = responseUser;
        this.userUpdated = true;
      //  this.router.navigate(['/user/' + this.id]);
      });
  }
  addLinkedAccount() {
    const linkedAccounts = this.updateForm.get('linked_accounts') as FormArray;
    linkedAccounts.push(new FormControl(''));
  }
  removeLinkedAccount(index: number) {
    const linkedAccounts = this.updateForm.get('linked_accounts') as FormArray;
    linkedAccounts.removeAt(index);
  }
  get linkedAccounts() {
    return this.updateForm.get('linked_accounts') as FormArray;
  }
  /*constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      nick: [''],
      profile_img: [''],
      bio_text: [''],
      linked_accounts: [this.fb.array([])],
      likedTags: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.userService.getUserById(1).subscribe(user => {
      this.userForm.patchValue(user);

      user?.linked_accounts?.forEach(account => {
        this.linkedAccounts.push(this.fb.control(account));
      }
   )
      user?.likedTags?.forEach(tag => {
        this.likedTags.push(this.fb.control(tag.name));
        });
      });
  }

 addLinkedAccount() {
    (this.userForm.get('linked_accounts') as FormArray).push(this.fb.control(''));
  }

 removeLinkedAccount(index: number) {
    (this.userForm.get('linked_accounts') as FormArray).removeAt(index);
  }

 addTag() {
    (this.userForm.get('likedTags') as FormArray).push(this.fb.control(''));
  }

 removeTag(index: number) {
    (this.userForm.get('likedTags') as FormArray).removeAt(index);
  }

  get linkedAccounts() {
    return this.userForm.get('linked_accounts') as FormArray;
  }

  get likedTags() {
    return this.userForm.get('likedTags') as FormArray;
  }

 saveProfile() {
    console.log(this.userForm.value);
    this.userService.updateUser(1, this.userForm.value).subscribe(response => {
      console.log('Perfil actualizado', response);
    });
  }*/
}
