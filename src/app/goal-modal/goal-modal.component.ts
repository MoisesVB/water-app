import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
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

  handleSetGoal() {
    this.defineGoalNotifier.emit(this.inputValue);
    this.inputValue = '';
  }
}
