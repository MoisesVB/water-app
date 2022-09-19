import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from './activity';
import { Constants } from './constants';
import { Cup } from './cup';

@Injectable({
  providedIn: 'root'
})
export class StoreLocalService {

  constructor() { }

  // services should return strings only
  // services will receive formatted params (number, string, obj)
  // components will convert data from one type to another to services and to display into screen
  // components will validate UI logic and services will validate business logic
  // in component: first convert the value, pass to service and after update the local value and set UI variable state

  // goal methods
  addGoal(goal: number) {
    if (!goal || goal <= 0 || goal > Constants.MAX_WATER_TARGET || typeof goal !== 'number') {
      throw new Error('Received goal is invalid');
    }

    localStorage.setItem("goal", JSON.stringify(goal));
  }

  getGoal() {
    const goal = localStorage.getItem("goal")!;
    const goalNumber = Number(goal);

    if (!goalNumber || goalNumber <= 0 || goalNumber > Constants.MAX_WATER_TARGET || typeof goalNumber !== 'number') {
      throw new Error('Goal is invalid');
    }

    return goal; // return the string
  }

  // intake methods
  addIntake(intake: number) {
    const storedIntake = Number(this.getIntake()!);
    let toUpdateIntake;

    if (storedIntake) {
      toUpdateIntake = storedIntake + intake;
    } else {
      toUpdateIntake = intake;
    }

    if (!toUpdateIntake || toUpdateIntake <= 0 || toUpdateIntake > Constants.MAX_WATER_TARGET || typeof toUpdateIntake !== 'number') {
      throw new Error('To update intake is invalid');
    }

    localStorage.setItem("intake", JSON.stringify(toUpdateIntake));
  }

  getIntake() {
    const intake = localStorage.getItem("intake")!;
    const intakeNumber = Number(intake);

    if (!intakeNumber || intakeNumber <= 0 || intakeNumber > Constants.MAX_WATER_TARGET || typeof intakeNumber !== 'number') {
      throw new Error('Intake is invalid');
    }

    return intake;
  }

  deleteIntake(intake: number) {
    if (!intake || intake <= 0 || intake > Constants.MAX_WATER_TARGET || typeof intake !== 'number') {
      throw new Error('Intake to delete is invalid');
    }

    const storedIntake = Number(this.getIntake()!);

    const newIntake = Number((storedIntake - intake).toFixed(2));

    if (!newIntake || newIntake <= 0 || newIntake > Constants.MAX_WATER_TARGET || typeof newIntake !== 'number') {
      throw new Error('Intake to delete is invalid');
    }

    localStorage.setItem("intake", JSON.stringify(newIntake));
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