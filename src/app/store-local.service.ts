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

  getGoal() {
    return localStorage.getItem("goal");
  }

  // intake methods
  addIntake(intake: number) {
    const storedIntake = parseInt(this.getIntake()!);
    let toUpdateIntake;

    if (storedIntake) {
      toUpdateIntake = storedIntake + intake;
    } else {
      toUpdateIntake = intake;
    }

    localStorage.setItem("intake", toUpdateIntake.toString());
  }

  getIntake() {
    return localStorage.getItem("intake");
  }

  deleteIntake(intake: number) {
    const storedIntake = parseInt(this.getIntake()!);

    const newIntake = storedIntake - intake;

    localStorage.setItem("intake", newIntake.toString());
  }

  // activity methods
  addActivity(intake: number) {
    let activity: Activity = this.getAllActivity();

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

  getAllActivity(): Activity {
    return JSON.parse(localStorage.getItem("activity")!);
  }

  deleteActivityById(id: string) {
    let activity = this.getAllActivity();

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

  getReminder() {
    return localStorage.getItem("reminder");
  }

  // day methods
  addCurrentDay() {
    localStorage.setItem("currentDay", new Date().getDate().toString());
  }

  getCurrentDay() {
    return localStorage.getItem("currentDay");
  }

  // cup methods
  addCup(capacity: number, isCustom: boolean) {
    let cups = this.getAllCups();

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

  getAllCups(): Cup[] {
    return JSON.parse(localStorage.getItem('cups')!);
  }

  deleteCupById(id: string) {
    const cups = this.getAllCups();

    const newCups = cups.filter(cup => cup.id !== id);

    localStorage.setItem('cups', JSON.stringify(newCups));
  }

  deleteAllData() {
    localStorage.clear();
  }
}