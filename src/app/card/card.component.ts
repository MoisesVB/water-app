import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cup } from '../../shared/models/cup';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  @Input() cup!: Cup;
  @Input() selectedCup?: string;
  @Output() selected = new EventEmitter<string>();

  click() {
    this.selected.emit(this.cup.id);
  }
}