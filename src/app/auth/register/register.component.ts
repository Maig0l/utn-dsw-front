import { Component } from '@angular/core';
import { FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../components/services/auth/register.service.js';
import { RegisterRequest } from '../../components/services/auth/registerRequest.js';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'regster',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  registerError: string ="";

  registerForm = this.fb.group({
    username: ['', Validators.required], //, Validators.minLength(6) lo rompe todo? 
    password: ['', Validators.required],
    email: ['', Validators.required],
  });

constructor(private fb: FormBuilder, private router: Router, private registerService: RegisterService
) {}

    get username() { return this.registerForm.controls.username }
    get password() { return this.registerForm.controls.password }
    get email() { return this.registerForm.controls.email }

    register() {
        if(this.registerForm.valid) {  
        this.registerService.register(this.registerForm.value as RegisterRequest).subscribe({
            next: (userData) => {
                console.log(userData);
            },
            error: (error) => {
                console.error(error);
                this.registerError = error;
            },
            complete: () => { 
                console.info("Register completed");
                this.router.navigateByUrl('/homepage'); //TODO al inicio
                this.registerForm.reset(); }
            });
        } else {
            this.registerForm.markAllAsTouched();
            alert("Form is invalid");
        }
    
    }
}