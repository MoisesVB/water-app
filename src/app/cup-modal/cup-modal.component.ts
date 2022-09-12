import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  capacity: string = '';

  @Input() isCupModalOpen!: boolean;

  @Output() closeCupModalNotifier = new EventEmitter<MouseEvent>();

  @Output() createCupNotifier = new EventEmitter<string>();

  onInput(event: Event) {
    this.capacity = (event.target as HTMLInputElement).value;
  }

  validate() {
    return parseInt(this.capacity) ? false : true;
  }

  createCup() {
    this.createCupNotifier.emit(this.capacity);
    this.closeCupModalNotifier.emit();
    this.capacity = '';
  }
}
