import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html',
})
export class LogModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() isLogOpen!: boolean;

  @Output() closeLogNotifier = new EventEmitter();
}
