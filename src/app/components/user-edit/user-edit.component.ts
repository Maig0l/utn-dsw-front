import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-user-edit',
  standalone: true,
    imports: [ReactiveFormsModule, CommonModule,
      MatCardModule,
      MatIconModule,
      MatFormFieldModule,
      MatButtonModule,
      MatInputModule,
      MatSelectModule,
      MatRippleModule,
      MatChipsModule,
      ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
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
  }
}
