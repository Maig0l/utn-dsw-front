import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hola, mundo! 🐣';
  subtitle = 'Se vienen cositas 👀'
  contributors = [
    { user: "Maig0l", name: "Miguel" },
    { user: "RST5150", name: "Ricardo" },
    { user: "luchocsd", name: "Luciano" },
    { user: "Matiasanin", name: "Matías" }
  ]
}
