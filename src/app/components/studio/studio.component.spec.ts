import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioComponent } from './studio.component';

describe('StudioComponent', () => {
    let component: StudioComponent;
    let fixture: ComponentFixture<StudioComponent>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StudioComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(StudioComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});