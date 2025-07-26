import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';
import { TagService } from '../../services/tag.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from '../../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;
  let service: TagService;
  //let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent, HttpClientModule, AppComponent, BrowserAnimationsModule],providers:[TagService]
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(TagService);
  });

  
 // httpMock = TestBed.inject(HttpTestingController);


  it('should create', () => {
    expect(component).toBeTruthy();
  });


 
});
