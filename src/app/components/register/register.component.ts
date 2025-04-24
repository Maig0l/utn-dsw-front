import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/auth/register.service';
import { RegisterRequest } from '../../services/auth/registerRequest';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerError = '';
  /*
  passwordForm: FormGroup = new FormGroup({
    password: new FormControl<String>('', Validators.required),
    confirmPassword: new FormControl<String>('', Validators.required),
    });*/

  registerForm = this.fb.group({
    nick: ['', Validators.required], //, Validators.minLength(6) lo rompe todo?
    password: ['', Validators.required],
    email: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
  ) {}

  get username() {
    return this.registerForm.controls.nick;
  }
  get password() {
    return this.registerForm.controls.password;
  }
  get email() {
    return this.registerForm.controls.email;
  }

  register() {
    if (this.registerForm.valid) {
      this.registerService
        .register(this.registerForm.value as RegisterRequest)
        .subscribe({
          next: (userData) => {
            console.log(userData);
          },
          error: (error) => {
            console.error(error);
            this.registerError = error;
          },
          complete: () => {
            console.info('Register completed');
            this.router.navigateByUrl('/homepage'); //TODO al inicio
            this.registerForm.reset();
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      alert('Form is invalid');
    }
  }
}
