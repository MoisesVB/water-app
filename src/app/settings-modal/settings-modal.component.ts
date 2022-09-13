import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Cup } from '../cup';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  animations: [
    trigger('leaveEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SettingsModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown.escape', ['$event'])
  closeSettingsOnEsc() {
    if (this.isSettingsOpen) {
      this.closeSettingsNotifier.emit();
    }
  }

  @Output() closeSettingsNotifier = new EventEmitter();
  @Output() changeGoalNotifier = new EventEmitter();
  @Output() changeReminderNotifier = new EventEmitter();
  @Output() deleteDataNotifier = new EventEmitter();
  @Output() deleteCustomCupNotifier = new EventEmitter<string>();

  @Input() selectedReminder!: number;
  @Input() cups!: Cup[];
  @Input() isSettingsOpen!: boolean;

  customCupsIsPresent() {
    const customCups = this.cups.filter(cup => cup.isCustom);

    if (customCups.length > 0) {
      return true;
    }

    return false;
  }
}
