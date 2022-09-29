import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateReminder } from 'src/shared/reminder.validator';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
})
export class ReminderModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() isVisible!: boolean;
  @Output() add = new EventEmitter<string>();

  @HostListener('document:keydown.enter', ['$event'])
  emitAddReminderOnEnter() {
    if (this.isVisible && this.reminder.valid) {
      this.emitAddReminder();
    }
  }

  reminder = new FormControl('60', [
    Validators.pattern(/^\d+$/), // accepts only  numbers
    Validators.maxLength(4),
    Validators.required,
    validateReminder
  ]);

  setReminder(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.reminder.setValue(value);
  }

  emitAddReminder() {
    this.add.emit(this.reminder.value!);
    this.reminder.reset();
  }
}
