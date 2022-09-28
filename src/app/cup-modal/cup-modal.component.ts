import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateCup } from 'src/shared/cup.validator';

@Component({
  selector: 'app-cup-modal',
  templateUrl: './cup-modal.component.html',
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
export class CupModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() isCupModalOpen!: boolean;

  @Output() closeCupModalNotifier = new EventEmitter<MouseEvent>();

  @Output() createCupNotifier = new EventEmitter();

  @HostListener('document:keydown.escape', ['$event'])
  closeCupModalOnEsc() {
    if (this.isCupModalOpen) {
      this.closeCupModalNotifier.emit();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  createCupOnEnter() {
    if (this.isCupModalOpen && this.cup.valid) {
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
    this.closeCupModalNotifier.emit();
    this.cup.reset();
  }
}
