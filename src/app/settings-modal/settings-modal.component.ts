import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cup } from '../cup';

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
  @Output() deleteCustomCupNotifier = new EventEmitter<string>();

  @Input() selectedReminder!: number;
  @Input() cups!: Cup[];

  customCupsIsPresent() {
    const customCups = this.cups.filter(cup => cup.isCustom);

    if (customCups.length > 0) {
      return true;
    }

    return false;
  }
}
