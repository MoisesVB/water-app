import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Activity, ActivityData } from '../activity';

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

  @Input() activity!: Activity;

  @Output() closeLogNotifier = new EventEmitter();

  @Output() deleteActivityNotifier = new EventEmitter<ActivityData>();

  @HostListener('document:keydown.escape', ['$event'])
  closeLogOnEsc() {
    if (this.isLogOpen) {
      this.closeLogNotifier.emit();
    }
  }

  sortByDate(activity: Activity) {
    if (activity) {
      const arr = Object.keys(activity).sort((a, b) => {
        return +new Date(a) - +new Date(b);
      });

      // returning from most recent date to oldest
      return arr.reverse();
    }

    return activity;
  }

  getTodayDate() {
    return new Date().toLocaleDateString();
  }

  countIntake(data: ActivityData[]) {
    return data.reduce((acc, obj) => acc + obj.intake, 0);
  }

  getActivityLength(activity: Activity) {
    if (activity) {
      return Object.keys(activity).length;
    }

    return 0;
  }
}
