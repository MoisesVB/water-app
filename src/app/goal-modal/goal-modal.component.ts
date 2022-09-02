import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
})
export class GoalModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  inputValue: string = '';

  @Input() isGoalDefined!: boolean;
  @Output() defineGoalNotifier = new EventEmitter();

  onInput(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  // validate if input is not empty and if it's a number
  validate() {
    return parseInt(this.inputValue) ? false : true;
  }
}
