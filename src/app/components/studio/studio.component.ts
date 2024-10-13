import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudioService, Studio } from '../services/studio.service.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [RouterOutlet,StudioService],
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.css'],
})
export class StudioComponent {

    studioForm = new FormGroup({
        name: new FormControl(''),
        type: new FormControl(''),
        site: new FormControl('')
        });

    deleteForm = new FormGroup({
        id: new FormControl('')
    })

    studio: Studio | undefined
    studios: Studio[] | undefined

    constructor(private studioService: StudioService) { }

    showStudios() {
        this.studioService.getAllStudios()
        .subscribe(responseStudios => this.studios = responseStudios)
    }

    addStudio() {
        this.studioService.addStudio(
            this.studioForm.value.name ?? "",
            this.studioForm.value.type ?? "",
            this.studioForm.value.site ?? ""
        ).subscribe(responseStudio => this.studio = responseStudio)
    }

    deleteStudio() {
        this.studioService.deleteStudio(
            this.deleteForm.value.id ?? ""
        )
        .subscribe(res => console.log(res))
    }
}