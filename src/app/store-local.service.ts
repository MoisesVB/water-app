import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { History } from './history';

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
    let storedIntake = parseInt(this.findIntake()!);

    if (storedIntake) {
      storedIntake += intake;
    } else {
      storedIntake = intake;
    }

    localStorage.setItem("intake", storedIntake.toString());
    this.addIntakeToHistory(intake);
  }

  addIntakeToHistory(intake: number) {
    let history: History = this.findHistory();

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

  findHistory(): History {
    return JSON.parse(localStorage.getItem("history")!);
  }

  destroyHistory(id: string) {
    let history = this.findHistory();

    for (let key in history) {
      history[key] = history[key].filter(obj => obj.id !== id);

      if (history[key].length <= 0) {
        delete history[key];
      }
    }

    localStorage.setItem("history", JSON.stringify(history));
  }

  findIntake() {
    return localStorage.getItem("intake");
  }

  // decrease intake
  destroyIntake(intake: number) {
    const storedIntake = parseInt(this.findIntake()!);

    const newIntake = storedIntake - intake;

    localStorage.setItem("intake", newIntake.toString());
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