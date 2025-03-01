import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FranchiseService, Franchise } from '../../services/franchise.service';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      name: new FormControl(''),
      games: new FormControl() //TODO  must recieve an array of games
    });

    deleteForm = new FormGroup({
      id: new FormControl(0)
    })

    updateForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      //games: new FormControl() //TODO  must recieve an array of games
    })

    franchiseIdForm = new FormGroup({
      id: new FormControl(0)
    });

    franchise: Franchise | undefined
    franchises: Franchise[] | undefined

    constructor(private franchiseService: FranchiseService, private fb: FormBuilder) { }

  showFranchises() {
    this.franchiseService.getAllFranchises()
      .subscribe(responseFranchises => this.franchises = responseFranchises)
  }

  addFranchise() {
    this.franchiseService.addFranchise(
      this.franchiseForm.value.name ?? "",
      this.franchiseForm.value.games ?? [] //TODO must recieve an array of games
    ).subscribe(responseFranchise => this.franchise = responseFranchise)
  }

  updateFranchise() {
    this.franchiseService.updateFranchise(
      this.updateForm.value.id ?? 0,
      this.updateForm.value.name ?? "",
      //this.updateForm.value.games ?? []
    )
    .subscribe(responseFranchise => this.franchise = responseFranchise)
  }

  deleteFranchise() {
    this.franchiseService.deleteFranchise(
      this.deleteForm.value.id ?? 0
    )
    .subscribe(res => console.log(res))
  }

  editReady: boolean = false;

  populateForm() {
  const id = this.franchiseIdForm.get('id')?.value;
  if (id) {
    this.franchiseService.getOneFranchise(id).subscribe(
      (data: Franchise) => {
        this.updateForm.setValue({
          id: data.id,
          name: data.name,
        });
        this.editReady = true;
      }); //TODO handle error?
  } else {
    this.editReady = false;
  }
}
}
