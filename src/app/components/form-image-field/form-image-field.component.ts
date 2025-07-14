import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
} from '@angular/material/button';

const modeIcons = [
  'insert_link', //index 0 for Link mode
  'file_upload', //index 1 for Upload mode
];

@Component({
  selector: 'app-form-image-field',
  standalone: true,
  imports: [
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-image-field.component.html',
  styleUrl: './form-image-field.component.css',
})
export class FormImageFieldComponent {
  @Input({ required: true }) parentFormFileControlName!: string;
  @Input({ required: true }) parentFormUrlControlName!: string;

  // Form control is in either Upload mode or Link mode
  // Using boolean to simplify
  isInUploadMode = true;
  modeIcon = modeIcons[+!this.isInUploadMode];

  toggleMode() {
    this.isInUploadMode = !this.isInUploadMode;

    // Show the icon for the opposite mode
    this.modeIcon = modeIcons[+!this.isInUploadMode];
  }

  emitHref() {
    console.info(`Load href`);
    //this.formControlHref.value = this.inputHref.value;
  }

  emitFile() {
    console.info(`Load file`);
    //this.formControlFile.value = this.inputFile.value;
  }
}
