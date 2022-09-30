import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReminderModalComponent } from './reminder-modal.component';

@Component({ selector: 'app-modal', template: '' })
class ModalStubComponent { }

describe('ReminderModalComponent', () => {
  let component: ReminderModalComponent;
  let fixture: ComponentFixture<ReminderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderModalComponent, ModalStubComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReminderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
