import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformComponent } from './platform.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../../app.component';

describe('PlatformComponent', () => {
  let component: PlatformComponent;
  let fixture: ComponentFixture<PlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformComponent, HttpClientModule, AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
