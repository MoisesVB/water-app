import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity, ActivityData } from '../activity';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html',
})
export class LogModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.register('activity');
  }

  @Input() activity!: Activity;
  @Output() deleteActivityNotifier = new EventEmitter<ActivityData>();

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

  closeModal() {
    this.modalService.setIsVisible('activity', false);
  }
}
