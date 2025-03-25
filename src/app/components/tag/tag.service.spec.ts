import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';
import { TagService } from '../../services/tag.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from '../../app.component';


describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;
  let service: TagService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent, HttpClientModule, AppComponent, HttpClientTestingModule],providers:[TagService]
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(TagService);
    httpMock = TestBed.inject(HttpTestingController);
  });



  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('get all tags', ()=>{
    const mockData = [{ id: 1, name: 'Item 1', description: 'Cosas' }, { id: 2, name: 'Item 2', description: 'Cosas' }];

    service.getAllTags().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tags'); // Verifica la URL
    expect(req.request.method).toBe('GET'); // Asegura que sea un GET
    req.flush(mockData); // Responde con datos mockeados



  })


  it('get one tags', ()=>{
    const mockData = { id: 1, name: 'Fantasy', description: 'Cosas' };

    service.getOneTag(1).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tags/1'); // Verifica la URL
    expect(req.request.method).toBe('GET'); // Asegura que sea un GET
    req.flush(mockData); // Responde con datos mockeados

  })
    
  
  it('delete one tag', () => {
    const id = 1;

    service.deleteTag(id).subscribe((response) => {
      expect(response).toBeUndefined(); // DELETE devuelve vacío (void)
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/tags/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null); // Simula respuesta vacía
  });

  it('add one tag', () => {
    const newItem = {name: 'Science Fiction', description: 'Cosas' };
    const mockResponse = { id: 1 };

    service.addTag('Science Fiction', 'Cosas').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tags');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);

    req.flush(mockResponse); // Simula respuesta con ID
  });


  it('update one tag', () => {
    const id = 1;
    const updatedItem = {id:1, name:'Science Fiction',description: 'Cosas' };
    const mockResponse = { success: true };

    service.updateTag(id, 'Science Fiction', 'Cosas').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/tags/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedItem);

    req.flush(mockResponse); // Simula respuesta de éxito
  });

  it('get tags by name', () => {
    const tagName = 'Fantasy';
    const mockResponse = {
      data: [{ id: 1, name: 'Fantasy',description: 'Cosas'  }, { id: 2, name: 'Strategy', description: 'Cosas' }],
    };

    service.getTagsByName(tagName).subscribe((tags) => {
      expect(tags).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/tags/search?name=${tagName}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

  });


  it('debería devolver un array vacío si no hay tags', () => {
    const tagName = 'unknown';
    const mockResponse = { data: [] };
  
    service.getTagsByName(tagName).subscribe((tags) => {
      expect(tags).toEqual([]);
    });
  
    const req = httpMock.expectOne(`http://localhost:8080/api/tags/search?name=${tagName}`);
    req.flush(mockResponse);
  });
});