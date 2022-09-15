import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from './activity';
import { Cup } from './cup';

@Injectable({
  providedIn: 'root'
})
export class StoreLocalService {

  constructor() { }

  // goal methods
  addGoal(goal: number) {
    localStorage.setItem("goal", goal.toString());
  }

  findGoal() {
    return localStorage.getItem("goal");
  }

  // intake methods
  addIntake(intake: number) {
    const storedIntake = parseInt(this.findIntake()!);
    let toUpdateIntake;

    if (storedIntake) {
      toUpdateIntake = storedIntake + intake;
    } else {
      toUpdateIntake = intake;
    }

    localStorage.setItem("intake", toUpdateIntake.toString());
    this.addActivity(intake);
  }

  findIntake() {
    return localStorage.getItem("intake");
  }

  destroyIntake(intake: number) { // decrease intake
    const storedIntake = parseInt(this.findIntake()!);

    const newIntake = storedIntake - intake;

    localStorage.setItem("intake", newIntake.toString());
  }

  // activity methods
  addActivity(intake: number) {
    let activity: Activity = this.findActivity();

    const id = uuidv4();
    const date = new Date().toLocaleDateString();
    const hour = new Date().toLocaleTimeString();

    const temp = {
      id: id,
      hour: hour,
      intake: intake
    }

    if (!activity) {
      activity = {};
    }

    if (!activity.hasOwnProperty(`${date}`)) {
      activity[`${date}`] = [temp]
    } else if (activity.hasOwnProperty(`${date}`)) {
      activity[`${date}`].push(temp);
    }

    localStorage.setItem("activity", JSON.stringify(activity));
  }

  findActivity(): Activity {
    return JSON.parse(localStorage.getItem("activity")!);
  }

  deleteActivity(id: string) {
    let activity = this.findActivity();

    for (let key in activity) {
      activity[key] = activity[key].filter(obj => obj.id !== id);

      if (activity[key].length <= 0) {
        delete activity[key];
      }
    }

    localStorage.setItem("activity", JSON.stringify(activity));
  }

  // reminder methods
  addReminder(value: number) {
    localStorage.setItem("reminder", value.toString());
  }

  findReminder() {
    return localStorage.getItem("reminder");
  }

  // currentDay methods
  addCurrentDay() {
    localStorage.setItem("currentDay", new Date().getDate().toString());
  }

  findStoredDay() {
    return localStorage.getItem("currentDay");
  }

  // cup methods
  addCup(capacity: number, isCustom: boolean) {
    let cups = this.findCups();

    const newCup: Cup = {
      id: uuidv4(),
      capacity: capacity,
      isCustom: isCustom
    }

    if (!cups) {
      cups = [];
    }

    cups.push(newCup);

    localStorage.setItem('cups', JSON.stringify(cups));
  }

  findCups(): Cup[] {
    return JSON.parse(localStorage.getItem('cups')!);
  }

  deleteCup(id: string) {
    const cups = this.findCups();

    const newCups = cups.filter(cup => cup.id !== id);

    localStorage.setItem('cups', JSON.stringify(newCups));
  }

  destroyAllData() {
    localStorage.clear();
  }
}