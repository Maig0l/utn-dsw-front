import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule} from '@angular/material/list';
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';








@Component({
  selector: 'app-cruds',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, RouterModule, MatToolbarModule, MatIconModule],
  templateUrl: './cruds.component.html',
  styleUrl: './cruds.component.css'
})
export class CrudsComponent {

}
