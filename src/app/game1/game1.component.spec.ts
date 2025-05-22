import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Game1Component } from './game1.component';

describe('Game1Component', () => {
  let component: Game1Component;
  let fixture: ComponentFixture<Game1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Game1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Game1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
