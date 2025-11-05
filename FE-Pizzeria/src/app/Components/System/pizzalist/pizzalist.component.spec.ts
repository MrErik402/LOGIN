import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzalistComponent } from './pizzalist.component';

describe('PizzalistComponent', () => {
  let component: PizzalistComponent;
  let fixture: ComponentFixture<PizzalistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzalistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PizzalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
