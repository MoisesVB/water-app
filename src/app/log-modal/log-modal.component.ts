import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { History, HistoryData } from '../history';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html',
})
export class LogModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  @Input() isLogOpen!: boolean;

  @Input() history!: History;

  @Output() closeLogNotifier = new EventEmitter();

  @Output() deleteHistoryNotifier = new EventEmitter<HistoryData>();

  sortByDate(history: History) {
    if (history) {
      return Object.keys(history).sort((a, b) => {
        return +new Date(a) - +new Date(b);
      });
    }

    return history;
  }

  getTodayDate() {
    return new Date().toLocaleDateString();
  }

  countIntake(data: HistoryData[]) {
    return data.reduce((acc, obj) => acc + obj.intake, 0);
  }
}
