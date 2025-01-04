import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../components/services/auth/login.service.js';
import { LoginRequest } from '../../components/services/auth/loginRequest.js';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginError: string = "";

  loginForm = this.fb.group({
    username: ['', Validators.required], //, Validators.minLength(6) lo rompe todo? 
    password: ['', Validators.required]
  });
  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService
  ) { }

  get username() { return this.loginForm.controls.username ?? '' }
  get password() { return this.loginForm.controls.password ?? '' }


  login() {
    if (this.loginForm.valid) {
      let requestBody: LoginRequest = {
        nick: this.username.value ?? '',
        password: this.password.value ?? ''
      }

      this.loginService.login(requestBody).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (error) => {
          console.error(error);
          this.loginError = error;
        },
        complete: () => {
          console.info("Login completed");
          this.router.navigateByUrl('/homepage'); //TODO al inicio
          this.loginForm.reset();
        }

      });

    } else {
      this.loginForm.markAllAsTouched();
      alert("Form is invalid");
    }
  }
}
