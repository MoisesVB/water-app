import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Goal } from 'src/shared/models/goal';
import { Activity, ActivityData } from '../../shared/models/activity';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
})
export class ActivityModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void { }

  @Input() isVisible!: boolean;
  @Input() activity!: Activity;
  @Input() goals!: Goal;
  @Output() deleteActivityNotifier = new EventEmitter<ActivityData>();

  @HostListener('document:keydown.escape', ['$event'])
  closeActivityOnEsc() {
    if (this.isVisible) {
      this.closeModal();
    }
  }

  getGoalByDate(date: string) {
    return this.goals[date];
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

  closeModal() {
    this.modalService.setVisibility('activity', false);
  }
}
