import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCrudComponent } from './game-crud.component';

describe('GameCrudComponent', () => {
  let component: GameCrudComponent;
  let fixture: ComponentFixture<GameCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
