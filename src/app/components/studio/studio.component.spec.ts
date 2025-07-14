import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioComponent } from './studio.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../../app.component';

describe('StudioComponent', () => {
  let component: StudioComponent;
  let fixture: ComponentFixture<StudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudioComponent, HttpClientModule, AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudioComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
