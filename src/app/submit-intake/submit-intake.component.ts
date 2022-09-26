import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-submit-intake',
  templateUrl: './submit-intake.component.html',
})
export class SubmitIntakeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  @Output() add = new EventEmitter();

  click() {
    this.add.emit();
  }
}
