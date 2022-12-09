import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CupIcon } from 'src/shared/models/cup-icon';
import { Cup } from '../../shared/models/cup';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {

  constructor(private el: ElementRef) { }

  readonly cupIcon = CupIcon;

  ngOnInit(): void {
    // if cup is selected when element is first loaded
    // this means that if cup was added right now
    if (this.cup.id === this.selectedCup) {
      this.el.nativeElement.scrollIntoView();
    }
  }

  @Input() cup!: Cup;
  @Input() selectedCup?: string;
  @Output() selected = new EventEmitter<string>();

  click() {
    this.selected.emit(this.cup.id);
  }
}