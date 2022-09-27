import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
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
    this.modalService.register('cup');
  }

  @Output() closeCupModalNotifier = new EventEmitter<MouseEvent>();

  @Output() createCupNotifier = new EventEmitter();

  @HostListener('document:keydown.enter', ['$event'])
  createCupOnEnter() {
    try {
      if (this.modalService.isVisible('cup') && this.cup.valid) {
        this.createCup();
      }
    } catch (err) { }
  }

  cup = new FormControl('', [
    Validators.pattern(/^\d+$/), // accepts only  numbers
    Validators.maxLength(5),
    Validators.required,
    validateCup
  ]);

  createCup() {
    this.createCupNotifier.emit(this.cup.value);
    this.closeCupModalNotifier.emit();
    this.cup.reset();
  }

  closeModal() {
    this.modalService.setIsVisible('cup', false);
  }
}
