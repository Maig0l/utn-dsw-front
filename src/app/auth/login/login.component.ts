import { Component } from '@angular/core';
import { FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required], //, Validators.minLength(6) lo rompe todo? 
    password: ['', Validators.required]
  });
  constructor(private fb: FormBuilder, private router: Router) {}

  login() {
    if(this.loginForm.valid) {  
    console.log("Call login service");
    this.router.navigateByUrl('/platform'); //TODO
    this.loginForm.reset();
  } else {
    alert("Form is invalid");
  } 
  }
}
