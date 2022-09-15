import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { History } from './history';
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
    let storedIntake = parseInt(this.findIntake()!);

    if (storedIntake) {
      storedIntake += intake;
    } else {
      storedIntake = intake;
    }

    localStorage.setItem("intake", storedIntake.toString());
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
    let history: History = this.findActivity();

    const id = uuidv4();
    const date = new Date().toLocaleDateString();
    const hour = new Date().toLocaleTimeString();

    const temp = {
      id: id,
      hour: hour,
      intake: intake
    }

    if (!history) {
      history = {};
    }

    if (!history.hasOwnProperty(`${date}`)) {
      history[`${date}`] = [temp]
    } else if (history.hasOwnProperty(`${date}`)) {
      history[`${date}`].push(temp);
    }

    localStorage.setItem("history", JSON.stringify(history));
  }

  findActivity(): History {
    return JSON.parse(localStorage.getItem("history")!);
  }

  deleteActivity(id: string) {
    let history = this.findActivity();

    for (let key in history) {
      history[key] = history[key].filter(obj => obj.id !== id);

      if (history[key].length <= 0) {
        delete history[key];
      }
    }

    localStorage.setItem("history", JSON.stringify(history));
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