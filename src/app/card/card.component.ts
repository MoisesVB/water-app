import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cup } from '../cup';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() cup!: Cup;
  @Input() selectedCup?: string;

  @Output() handleClickNotifier = new EventEmitter<string>();
}