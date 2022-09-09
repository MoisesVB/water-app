import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-submit-intake',
  template: '<button class="border border-white text-white rounded text-lg font-bold w-full mt-10 h-14 hover:border-blue-300 hover:shadow-sm shadow-blue-500/50 hover:text-blue-200 transition-all duration-300 select-none" (click)="addIntakeNotifier.emit()">SUBMIT</button>',
})
export class SubmitIntakeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() addIntakeNotifier = new EventEmitter();
}
