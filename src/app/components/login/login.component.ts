import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginError = '';

  loginForm = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(4), this.forbidBobUsername],
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  forbidBobUsername(control: AbstractControl) {
    const value = (control.value || '').toLowerCase();
    return value === 'bob' ? { forbiddenusername: true } : null;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) {}

  get username() {
    return this.loginForm.controls.username ?? '';
  }
  get password() {
    return this.loginForm.controls.password ?? '';
  }

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      alert('Form is invalid');
    }

    const requestBody: LoginRequest = {
      nick: this.username.value ?? '',
      password: this.password.value ?? '',
    };

    this.loginService.login(requestBody).subscribe({
      next: (userData) => {
        this.router.navigate(['/homepage']);
      },
      error: (error) => {
        console.error(error);
        this.loginError = error;
      },
      complete: () => {
        this.loginForm.reset();
      },
    });
  }
}
