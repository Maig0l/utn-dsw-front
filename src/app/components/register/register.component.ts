import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/auth/register.service';
import { RegisterRequest } from '../../services/auth/registerRequest';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerError = '';

  passwordsMatchValidator: ValidatorFn = (group) => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsDontMatch: true };
  };

  registerForm = this.fb.group(
    {
      nick: [
        '',
        [Validators.required, Validators.minLength(4), this.forbidBob],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    },
    { validators: this.passwordsMatchValidator },
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
  ) {}

  get nick() {
    return this.registerForm.controls.nick;
  }
  get password() {
    return this.registerForm.controls.password;
  }
  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }
  get email() {
    return this.registerForm.controls.email;
  }

  forbidBob(control: AbstractControl): ValidationErrors | null {
    return control.value?.toLowerCase() === 'bob'
      ? { forbiddennick: true }
      : null;
  }

  register() {
    if (this.registerForm.valid) {
      this.registerService
        .register(this.registerForm.value as RegisterRequest)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/homepage');
          },
          error: (err) => {
            this.registerError = err;
            console.error(err);
          },
          complete: () => {
            this.registerForm.reset();
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      alert('Form is invalid');
    }
  }
}
