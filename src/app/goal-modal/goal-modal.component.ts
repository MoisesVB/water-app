import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { validateGoal } from 'src/shared/goal.validator';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
})
export class GoalModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void { }

  @HostListener('document:keydown.enter', ['$event'])
  emitAddGoalOnEnter() {
    if (this.modalService.isVisible('goal') && this.goal.valid) {
      this.emitAddGoal();
    }
  }

  goal = new FormControl('', [
    Validators.pattern(/^\d+$/), // accepts only  numbers
    Validators.maxLength(5),
    Validators.required,
    validateGoal
  ]);

  @Output() add = new EventEmitter();

  emitAddGoal() {
    this.add.emit(this.goal.value);
    this.goal.reset();
  }
}
