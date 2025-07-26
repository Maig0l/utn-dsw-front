import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { GameService } from '../../services/game.service';
import { AppComponent } from '../../app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';



describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let service: GameService;
  let httpMock: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent, HttpClientModule, AppComponent, BrowserAnimationsModule, MatChipsModule, MatInputModule, HttpClientTestingModule],providers:[GameService]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    setTimeout(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
      done();
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('get all games', ()=>{
    const mockData = [{ "title": "Fallout 79",
    "synopsis": "Apocalipsis",
    "releaseDate": "2020-09-06T00:00:00.000Z",
    "portrait": "https://en.wikipedia.org/wiki/File:Fallout.jpg",
    "banner": "https://en.wikipedia.org/wiki/File:Fallout.jpg",
    "pictures": {
        "url": "https://en.wikipedia.org/wiki/File:Fallout.jpg"
    },
    "tags" : [0,1,5,4,8] }, {"title": "Fallout 15",
    "synopsis": "Apocalipsis",
    "releaseDate": "2020-09-06T00:00:00.000Z",
    "portrait": "https://en.wikipedia.org/wiki/File:Fallout.jpg",
    "banner": "https://en.wikipedia.org/wiki/File:Fallout.jpg",
    "pictures": {
        "url": "https://en.wikipedia.org/wiki/File:Fallout.jpg"
    },
    "tags" : [0,1,5,4,8] }];

    service.getAllGames().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/games'); // Verifica la URL
    expect(req.request.method).toBe('GET'); // Asegura que sea un GET
    req.flush(mockData); // Responde con datos mockeados



  })


  it('get one tags', ()=>{
    const mockData = { id: 1, "title": "Fallout 79",
      "synopsis": "Apocalipsis",
      "releaseDate": "2020-09-06T00:00:00.000Z",
      "portrait": "https://en.wikipedia.org/wiki/File:Fallout.jpg",
      "banner": "https://en.wikipedia.org/wiki/File:Fallout.jpg",
      "pictures": {
          "url": "https://en.wikipedia.org/wiki/File:Fallout.jpg"
      } };

    service.getOneGame(1).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/games/1'); // Verifica la URL
    expect(req.request.method).toBe('GET'); // Asegura que sea un GET
    req.flush(mockData); // Responde con datos mockeados

  })
  it('delete one game', () => {
    const id = 1;

    service.deleteGame(id).subscribe((response) => {
      expect(response).toBeUndefined(); // DELETE devuelve vacío (void)
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/games/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null); // Simula respuesta vacía
  });
/*
  it('add one game', () => {
    const newItem = {title: 'Age of mythology', synopsis:'mythology', releaseDate: "2020-09-06T00:00:00.000Z" , portrait: 'asd', banner:'asd' , franchise: 1, tags: [1,2,3,4], studios: [1,2,3], shops: [5,4], platforms: [4,2] };
    const mockResponse = { id: 1 };

    service.addGame('Age of mythology','mythology', "2020-09-06T00:00:00.000Z" ,  'asd', 'asd' ,  1,  [1,2,3,4],  [1,2,3],  [5,4],  [4,2] ).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/games');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);

    req.flush(mockResponse); // Simula respuesta con ID
  });
*/
  it('update one game', () => {
    const id = 1;
    const updatedItem = {id: id,title: 'Age of mythology', synopsis:'mythology', releaseDate: "2020-09-06T00:00:00.000Z" , portrait: 'asd', banner:'asd' , franchise: 1, tags: [1,2,3,4], studios: [1,2,3], shops: [5,4], platforms: [4,2] };
    const mockResponse = { success: true };

    service.updateGame(id, 'Age of mythology', 'mythology', "2020-09-06T00:00:00.000Z" ,  'asd', 'asd' ,  1, [1,2,3,4],  [1,2,3],  [5,4], [4,2]).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/games/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedItem);

    req.flush(mockResponse); // Simula respuesta de éxito
  });

  

  it('get games by name', () => {
    const gameTitle = 'a';
    const mockResponse = {
      data: [ {id: 1,title: 'Age of mythology', synopsis:'mythology', releaseDate: "2020-09-06T00:00:00.000Z" , portrait: 'asd', banner:'asd' , franchise: 1, tags: [1,2,3,4], studios: [1,2,3], shops: [5,4], platforms: [4,2]  }, {id: 2,title: 'Fallout', synopsis:'mythology', releaseDate: "2020-09-06T00:00:00.000Z" , portrait: 'asd', banner:'asd' , franchise: 1, tags: [1,2,3,4], studios: [1,2,3], shops: [5,4], platforms: [4,2] }],
    };

    service.findGamesByTitle(gameTitle).subscribe((games) => {
      expect(games).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/games/search?title=${gameTitle}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

  });

  it('debería devolver un array vacío si no hay games', () => {
    const gameTitle = 'unknown';
    const mockResponse = { data: [] };
  
    service.findGamesByTitle(gameTitle).subscribe((games) => {
      expect(games).toEqual([]);
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/api/games/search?title=${gameTitle}`);
    req.flush(mockResponse);
  });
  



});
function done() {
  throw new Error('Function not implemented.');
}

