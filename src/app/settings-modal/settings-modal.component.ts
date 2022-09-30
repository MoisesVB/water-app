import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Cup } from '../../shared/models/cup';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown.escape', ['$event'])
  closeSettingsOnEsc() {
    if (this.isVisible) {
      this.closeModal();
    }
  }

  @Output() closeSettingsNotifier = new EventEmitter();
  @Output() changeGoalNotifier = new EventEmitter();
  @Output() changeReminderNotifier = new EventEmitter();
  @Output() deleteDataNotifier = new EventEmitter();
  @Output() deleteCustomCupNotifier = new EventEmitter<string>();

  @Input() reminder?: number;
  @Input() cups?: Cup[];
  @Input() isVisible!: boolean;

  customCupsIsPresent() {
    const customCups = this.cups?.filter(cup => cup.isCustom);

    if (customCups && customCups.length > 0) {
      return true;
    }

    return false;
  }

  closeModal() {
    this.modalService.setVisibility('settings', false);
  }
}
