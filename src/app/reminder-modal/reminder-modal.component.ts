import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateReminder } from 'src/shared/reminder.validator';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
})
export class ReminderModalComponent implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown.enter', ['$event'])
  emitAddReminderOnEnter() {
    if (this.modalService.isVisible('reminder') && this.reminder.valid) {
      this.emitAddReminder();
    }
  }

  setReminder(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.reminder.setValue(value);
  }

  reminder = new FormControl('', [
    Validators.pattern(/^\d+$/), // accepts only  numbers
    Validators.maxLength(5),
    Validators.required,
    validateReminder
  ]);

  @Output() add = new EventEmitter();

  emitAddReminder() {
    this.add.emit(this.reminder.value);
    this.reminder.reset();
  }
}
