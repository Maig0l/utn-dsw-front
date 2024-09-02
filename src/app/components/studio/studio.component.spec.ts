import { ComponentFixture, TestBed } from "@angular/core/testing/index.js";
import { StudioComponent } from "./studio.component.js";

describe("StudioComponent", () => {
    let component: StudioComponent;
    let fixture: ComponentFixture<StudioComponent>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [StudioComponent]
        })
        .compileComponents();
        
        fixture = TestBed.createComponent(StudioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
