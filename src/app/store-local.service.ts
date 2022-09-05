import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreLocalService {

  constructor() { }

  addGoal(goal: number) {
    localStorage.setItem("goal", goal.toString());
  }

  findGoal() {
    return localStorage.getItem("goal");
  }

  addIntake(intake: number) {
    localStorage.setItem("intake", intake.toString());
  }

  findIntake() {
    return localStorage.getItem("intake");
  }

  addReminder(value: number) {
    localStorage.setItem("reminder", value.toString());
  }

  findReminder() {
    return localStorage.getItem("reminder");
  }

  addCurrentDay() {
    localStorage.setItem("currentDay", new Date().getDate().toString());
  }

  findStoredDay() {
    return localStorage.getItem("currentDay");
  }

  destroyAllData() {
    localStorage.clear();
  }
}
