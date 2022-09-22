import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Activity, ActivityData } from './activity';
import { Constants } from './constants';
import { Cup } from './cup';

@Injectable({
  providedIn: 'root'
})
export class StoreLocalService {

  constructor() { }

  // services will receive formatted params (number, string, obj)
  // components will convert data from one type to another to services and to display into screen
  // components will validate UI logic and services will validate business logic
  // in component: first convert the value, pass to service and after update the local value and set UI variable state
  // services should validate params and processed data to check for errors 

  // goal methods
  addGoal(goal: number) {
    if (goal <= 0 || goal > Constants.MAX_WATER_TARGET || !Number.isInteger(goal)) {
      throw new Error('Received goal is invalid');
    }

    localStorage.setItem("goal", JSON.stringify(goal));

    return goal;
  }

  getGoal() {
    let goal: number;

    try {
      goal = JSON.parse(localStorage.getItem("goal")!);
    } catch (err) {
      throw new Error('Goal is invalid');
    }

    if (goal <= 0 || goal > Constants.MAX_WATER_TARGET || !Number.isInteger(goal)) {
      throw new Error('Goal is invalid');
    }

    return goal;
  }

  // intake methods
  addIntake(intake: number) {
    if (intake < 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('To update intake is invalid');
    }

    let storedIntake: number | undefined;

    try {
      storedIntake = this.getIntake();
    } catch (err) {
      storedIntake = undefined;
    }

    let toUpdateIntake;

    if (storedIntake) {
      toUpdateIntake = storedIntake + intake;
    } else {
      toUpdateIntake = intake;
    }

    if (toUpdateIntake < 0 || toUpdateIntake > Constants.MAX_WATER_TARGET || !Number.isInteger(toUpdateIntake)) {
      throw new Error('To update intake is invalid');
    }

    localStorage.setItem("intake", JSON.stringify(toUpdateIntake));

    return toUpdateIntake;
  }

  getIntake() {
    let intake: number;

    try {
      intake = JSON.parse(localStorage.getItem("intake")!);
    } catch (err) {
      throw new Error('Intake is invalid');
    }

    if (intake < 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('Intake is invalid');
    }

    return intake;
  }

  deleteIntake(intake: number) {
    if (intake <= 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('Intake to delete is invalid');
    }

    let storedIntake: number;

    try {
      storedIntake = this.getIntake();
    } catch (err) {
      throw err;
    }

    const newIntake = storedIntake - intake;

    if (newIntake <= 0 || newIntake > Constants.MAX_WATER_TARGET || !Number.isInteger(newIntake)) {
      throw new Error('Intake to delete is invalid');
    }

    localStorage.setItem("intake", JSON.stringify(newIntake));

    return newIntake;
  }

  // activity methods
  addActivity(intake: number) {
    if (intake <= 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('Intake is invalid');
    }

    let activity: Activity | undefined;

    try {
      activity = this.getAllActivity();
    } catch (err) {
      activity = undefined;
    }

    const id = uuidv4();
    const date = new Date().toLocaleDateString();
    const hour = new Date().toLocaleTimeString();

    const temp: ActivityData = {
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

    const pushedActivity = activity[`${date}`].find((act: ActivityData) => act === temp);

    if (!activity || !activity.hasOwnProperty(`${date}`) || activity[`${date}`].length <= 0 || !pushedActivity) {
      throw new Error('Error in adding activity');
    }

    localStorage.setItem("activity", JSON.stringify(activity));

    return pushedActivity;
  }

  getAllActivity() {
    let activity: Activity;

    try {
      activity = JSON.parse(localStorage.getItem("activity")!);
    } catch (err) {
      throw new Error('Error parsing activities');
    }

    if (!activity || Object.keys(activity).length <= 0) {
      throw new Error('Activity is falsy');
    }

    for (let dateKey in activity) {
      if (!dateKey || !Date.parse(dateKey) || Number.isInteger(Number(dateKey))) {
        throw new Error('Invalid date key');
      }

      activity[dateKey].forEach(obj => {
        if (!obj.id || !obj.hour || !obj.intake || typeof obj.id !== 'string' || typeof obj.hour !== 'string' ||
          obj.intake <= 0 || obj.intake > Constants.MAX_WATER_TARGET || !Number.isInteger(obj.intake)) {
          throw new Error('Invalid activity found');
        }
      })
    }

    return activity;
  }

  deleteActivityById(id: string) {
    if (!id || typeof id !== 'string') {
      throw new Error('Id is invalid');
    }

    let activity: Activity;

    try {
      activity = this.getAllActivity();
    } catch (err) {
      throw err;
    }

    let activityToDelete: ActivityData | undefined;

    for (let key in activity) {
      activityToDelete = activity[key].find((obj: ActivityData) => obj.id === id);

      if (activityToDelete) {
        break;
      }
    }

    if (activityToDelete) {
      for (let key in activity) {
        activity[key] = activity[key].filter((obj: ActivityData) => obj.id !== id);

        if (activity[key].length <= 0) {
          delete activity[key];
        }
      }
    } else {
      throw new Error('Activity to delete not found');
    }

    localStorage.setItem("activity", JSON.stringify(activity));

    return activityToDelete;
  }

  // reminder methods
  addReminder(reminder: number) {
    if (reminder < 0 || reminder > 1440 || !Number.isInteger(reminder)) {
      throw new Error('Received reminder is invalid');
    }

    localStorage.setItem("reminder", JSON.stringify(reminder));

    return reminder;
  }

  getReminder() {
    let reminder: number;

    try {
      reminder = JSON.parse(localStorage.getItem("reminder")!);
    } catch (err) {
      throw new Error('Reminder is invalid');
    }

    if (reminder < 0 || reminder > 1440 || !Number.isInteger(reminder)) {
      throw new Error('Reminder is invalid');
    }

    return reminder;
  }

  // day methods
  addCurrentDay() {
    const date = new Date().getDate();

    if (date <= 0 || date > 31 || !Number.isInteger(date)) {
      throw new Error('Date is invalid');
    }

    localStorage.setItem("currentDay", JSON.stringify(date));

    return date;
  }

  getCurrentDay() {
    let currentDay: number;

    try {
      currentDay = JSON.parse(localStorage.getItem("currentDay")!);
    } catch (err) {
      throw new Error('Date is invalid');
    }

    if (currentDay <= 0 || currentDay > 31 || !Number.isInteger(currentDay)) {
      throw new Error('Date is invalid');
    }

    return currentDay;
  }

  // cup methods
  addCup(capacity: number, isCustom: boolean) {
    if (capacity <= 0 || capacity > Constants.MAX_WATER_TARGET || !Number.isInteger(capacity)) {
      throw new Error('Invalid cup values');
    }

    let cups: Cup[] | undefined;

    try {
      cups = this.getAllCups();
    } catch (err) {
      cups = undefined;
    }

    const newCup: Cup = {
      id: uuidv4(),
      capacity: capacity,
      isCustom: isCustom
    }

    if (!cups) {
      cups = [];
    }

    cups.push(newCup);

    const pushedCup = cups.find((cup: Cup) => cup === newCup);

    if (!cups || cups.length <= 0 || !pushedCup) {
      throw new Error('Error in adding cup');
    }

    localStorage.setItem('cups', JSON.stringify(cups));

    return pushedCup;
  }

  getAllCups() {
    let cups: Cup[];

    try {
      cups = JSON.parse(localStorage.getItem('cups')!);
    } catch (err) {
      throw new Error('Error parsing cups');
    }

    if (!cups || cups.length <= 0) {
      throw new Error('Cups is falsy');
    }

    cups.forEach(cup => {
      if (!cup.id || typeof cup.id !== 'string' || !cup.capacity || cup.capacity <= 0 || cup.capacity > Constants.MAX_WATER_TARGET || !Number.isInteger(cup.capacity) || cup.isCustom === undefined || cup.isCustom === null || typeof cup.isCustom !== 'boolean') {
        throw new Error('Invalid cup found');
      }
    })

    return cups;
  }

  deleteCupById(id: string) {
    if (!id || typeof id !== 'string') {
      throw new Error('Id is invalid');
    }

    let cups: Cup[];

    try {
      cups = this.getAllCups();
    } catch (err) {
      throw err;
    }

    const cupToDelete = cups.find(cup => cup.id === id);

    if (!cupToDelete) {
      throw new Error('Cup to delete not found');
    }

    const newCups = cups.filter(cup => cup.id !== id);

    localStorage.setItem('cups', JSON.stringify(newCups));

    return cupToDelete;
  }

  deleteAllData() {
    if (!localStorage.getItem('goal') && !localStorage.getItem('intake') && !localStorage.getItem('cups') && !localStorage.getItem('reminder') && !localStorage.getItem('activity') && !localStorage.getItem('currentDay')) {
      throw new Error('LocalStorage is empty');
    }

    localStorage.clear();

    if (localStorage.getItem('goal') || localStorage.getItem('intake') || localStorage.getItem('cups') || localStorage.getItem('reminder') || localStorage.getItem('activity') || localStorage.getItem('currentDay')) {
      throw new Error('LocalStorage is not empty');
    }

    return true;
  }
}