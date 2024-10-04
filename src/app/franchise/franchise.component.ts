import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FranchiseService, Franchise } from '../components/services/franchise.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-franchise',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [RouterOutlet,FranchiseService],
  templateUrl: './franchise.component.html',
  styleUrl: './franchise.component.css'
})
export class FranchiseComponent {

    franchiseForm = new FormGroup({
      //id:number,
      //TODO
    });

    deleteForm = new FormGroup({
      id: new FormControl(0)
    })

    updateForm = new FormGroup({
      //TODO
    })

    franchise: Franchise | undefined
    franchises: Franchise[] | undefined

    constructor(private franchiseService: FranchiseService) { }
  
  showFranchises() {
    this.franchiseService.getAllFranchises()
      .subscribe(responseFranchises => this.franchises = responseFranchises)
  }
  /* TODO
  addFranchise() {
    this.franchiseService.addFranchise(
      this.franchiseForm.value.name ?? "",
      this.franchiseForm.value.img ?? ""
    ).subscribe(responseFranchise => this.franchise = responseFranchise)
  }

  updateFranchise() {
    this.franchiseService.updateFranchise(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.name ?? "",
      this.updateForm.value.img ?? ""
    )
    .subscribe(responseFranchise => this.franchise = responseFranchise)
  }
  */
  deleteFranchise() {
    this.franchiseService.deleteFranchise(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(res => console.log(res))
  }
}
