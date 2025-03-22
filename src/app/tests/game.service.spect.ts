import { TestBed } from '@angular/core/testing';

import { GameService } from '../services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';


const mockGameService = {
    getGameData: () => of({ title: 'Test Game' })
  };

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientModule]});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});