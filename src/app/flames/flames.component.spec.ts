import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlamesComponent } from './flames.component';

describe('FlamesComponent', () => {
  let component: FlamesComponent;
  let fixture: ComponentFixture<FlamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
