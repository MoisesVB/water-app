import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-submit-intake',
  template: '<button class="border border-white text-white rounded text-lg font-bold w-full mt-10 h-14 hover:bg-white hover:text-black transition-all duration-300 select-none" (click)="addIntakeNotifier.emit()">SUBMIT</button>',
})
export class SubmitIntakeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() addIntakeNotifier = new EventEmitter();
}
