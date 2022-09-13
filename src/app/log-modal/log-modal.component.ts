import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { History, HistoryData } from '../history';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html',
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
export class LogModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  @Input() isLogOpen!: boolean;

  @Input() history!: History;

  @Output() closeLogNotifier = new EventEmitter();

  @Output() deleteHistoryNotifier = new EventEmitter<HistoryData>();

  @HostListener('document:keydown.escape', ['$event'])
  closeLogOnEsc() {
    if (this.isLogOpen) {
      this.closeLogNotifier.emit();
    }
  }

  sortByDate(history: History) {
    if (history) {
      const arr = Object.keys(history).sort((a, b) => {
        return +new Date(a) - +new Date(b);
      });

      // returning from most recent date to oldest
      return arr.reverse();
    }

    return history;
  }

  getTodayDate() {
    return new Date().toLocaleDateString();
  }

  countIntake(data: HistoryData[]) {
    return data.reduce((acc, obj) => acc + obj.intake, 0);
  }

  getHistoryLength(history: History) {
    if (history) {
      return Object.keys(history).length;
    }

    return 0;
  }
}
