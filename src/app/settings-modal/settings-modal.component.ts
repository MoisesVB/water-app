import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cup } from '../cup';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.register('settings');
  }

  @Output() changeGoalNotifier = new EventEmitter();
  @Output() changeReminderNotifier = new EventEmitter();
  @Output() deleteDataNotifier = new EventEmitter();
  @Output() deleteCustomCupNotifier = new EventEmitter<string>();

  @Input() reminder?: number;
  @Input() cups?: Cup[];

  customCupsIsPresent() {
    const customCups = this.cups?.filter(cup => cup.isCustom);

    if (customCups && customCups.length > 0) {
      return true;
    }

    return false;
  }

  closeModal() {
    this.modalService.setIsVisible('settings', false);
  }
}
