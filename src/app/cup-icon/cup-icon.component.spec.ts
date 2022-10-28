import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupIconComponent } from './cup-icon.component';

describe('CupIconComponent', () => {
  let component: CupIconComponent;
  let fixture: ComponentFixture<CupIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CupIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
