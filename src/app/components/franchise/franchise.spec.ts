import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseComponent } from './franchise.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FranchiseComponent', () => {
  let component: FranchiseComponent;
  let fixture: ComponentFixture<FranchiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchiseComponent, HttpClientModule, AppComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
