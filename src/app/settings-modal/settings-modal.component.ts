import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() closeSettingsNotifier = new EventEmitter();
  @Output() changeGoalNotifier = new EventEmitter();
  @Output() changeReminderNotifier = new EventEmitter();
  @Output() deleteDataNotifier = new EventEmitter();

  @Input() selectedReminder!: number;
}
