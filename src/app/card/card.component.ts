import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isCardSelected = false;

  @Input() cup: any;
  @Output() selectIntakeNotifier = new EventEmitter();

  emitSelectIntakeNotifier(intake: number) {
    if (!this.cup.selected) {
      this.selectIntakeNotifier.emit(0);
      return;
    }

    this.selectIntakeNotifier.emit(intake);
  }

  @Output() unselectExceptNotifier = new EventEmitter();
  @Output() unselectNotifier = new EventEmitter();
  selectCard() {
    if (this.cup.selected) {
      this.cup.selected = false;
      this.unselectNotifier.emit(this.cup);
    } else {
      this.cup.selected = true;
      this.unselectExceptNotifier.emit(this.cup);
    }
  }

  unselectCard() {

  }
}
