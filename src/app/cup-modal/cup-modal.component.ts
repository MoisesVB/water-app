import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateCup } from 'src/shared/cup.validator';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-cup-modal',
  templateUrl: './cup-modal.component.html',
})
export class CupModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

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

  createCup() {
    this.createCupNotifier.emit(this.cup.value);
    this.closeModal();
    this.cup.reset();
  }

  closeModal() {
    this.modalService.setVisibility('cup', false);
  }
}
