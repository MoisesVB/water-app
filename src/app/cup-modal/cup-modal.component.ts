import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateCup } from 'src/shared/cup.validator';
import { CupIcon } from 'src/shared/models/cup-icon';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-cup-modal',
  templateUrl: './cup-modal.component.html',
})
export class CupModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  readonly cupIcon = CupIcon;
  readonly arrCupIcon = Object.values(CupIcon);

  @Input() isVisible!: boolean;
  @Output() createCupNotifier = new EventEmitter();

  @HostListener('document:keydown.escape', ['$event'])
  closeCupModalOnEsc() {
    if (this.isVisible) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  createCupOnEnter() {
    if (this.isVisible && this.cup.valid) {
      this.createCup();
    }
  }

  cup = new FormControl('', [
    Validators.pattern(/^\d+$/), // accepts only  numbers
    Validators.maxLength(5),
    Validators.required,
    validateCup
  ]);

  icon = new FormControl('', [
    Validators.required,
    validateCup
  ]);

  setCupIcon(icon: CupIcon) {
    this.icon.setValue(icon);
  }

  createCup() {
    this.createCupNotifier.emit({ cup: this.cup.value, icon: this.icon.value });
    this.cup.reset();
    this.icon.reset();
  }

  closeModal() {
    this.modalService.setVisibility('cup', false);
  }
}
