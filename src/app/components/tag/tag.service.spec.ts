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
    
});