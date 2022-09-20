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

  // services should return strings only
  // services will receive formatted params (number, string, obj)
  // components will convert data from one type to another to services and to display into screen
  // components will validate UI logic and services will validate business logic
  // in component: first convert the value, pass to service and after update the local value and set UI variable state
  // services should validate params and processed data to check for errors 

  // goal methods
  addGoal(goal: number) {
    if (!goal || goal <= 0 || goal > Constants.MAX_WATER_TARGET || !Number.isInteger(goal)) {
      throw new Error('Received goal is invalid');
    }

    localStorage.setItem("goal", JSON.stringify(goal));
  }

  getGoal() {
    const goal = localStorage.getItem("goal")!;
    const goalNumber = Number(goal);

    if (!goalNumber || goalNumber <= 0 || goalNumber > Constants.MAX_WATER_TARGET || !Number.isInteger(goalNumber)) {
      throw new Error('Goal is invalid');
    }

    return goal; // return the string
  }

  // intake methods
  addIntake(intake: number) {
    if (!intake || intake <= 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('To update intake is invalid');
    }

    const storedIntake = Number(this.getIntake()!);
    let toUpdateIntake;

    if (storedIntake) {
      toUpdateIntake = storedIntake + intake;
    } else {
      toUpdateIntake = intake;
    }

    if (!toUpdateIntake || toUpdateIntake <= 0 || toUpdateIntake > Constants.MAX_WATER_TARGET || !Number.isInteger(toUpdateIntake)) {
      throw new Error('To update intake is invalid');
    }

    localStorage.setItem("intake", JSON.stringify(toUpdateIntake));
  }

  getIntake() {
    const intake = localStorage.getItem("intake")!;
    const intakeNumber = Number(intake);

    if (!intakeNumber || intakeNumber <= 0 || intakeNumber > Constants.MAX_WATER_TARGET || !Number.isInteger(intakeNumber)) {
      throw new Error('Intake is invalid');
    }

    return intake;
  }

  deleteIntake(intake: number) {
    if (!intake || intake <= 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('Intake to delete is invalid');
    }

    const storedIntake = Number(this.getIntake()!);

    const newIntake = storedIntake - intake;

    if (!newIntake || newIntake <= 0 || newIntake > Constants.MAX_WATER_TARGET || !Number.isInteger(newIntake)) {
      throw new Error('Intake to delete is invalid');
    }

    localStorage.setItem("intake", JSON.stringify(newIntake));
  }

  // activity methods
  addActivity(intake: number) {
    if (!intake || intake <= 0 || intake > Constants.MAX_WATER_TARGET || !Number.isInteger(intake)) {
      throw new Error('Intake is invalid');
    }

    let activity = JSON.parse(this.getAllActivity()!);

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

    const pushedActivity = activity[`${date}`].filter((act: ActivityData) => act === temp);

    if (!activity || !activity.hasOwnProperty(`${date}`) || activity[`${date}`].length <= 0 || !pushedActivity) {
      throw new Error('Error in adding activity');
    }

    localStorage.setItem("activity", JSON.stringify(activity));
  }

  getAllActivity() {
    const activity = localStorage.getItem("activity")!;
    let formattedActivity: Activity = {};

    try {
      formattedActivity = JSON.parse(activity);
    } catch (err) {
      throw new Error('Error parsing activities');
    }

    if (!formattedActivity || Object.keys(formattedActivity).length <= 0) {
      throw new Error('Activity is falsy');
    }

    for (let dateKey in formattedActivity) {
      if (!dateKey || !Date.parse(dateKey) || Number.isInteger(Number(dateKey))) {
        throw new Error('Invalid date key');
      }

      formattedActivity[dateKey].forEach(obj => {
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

    let activity = JSON.parse(this.getAllActivity()!);

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
  }

  // reminder methods
  addReminder(reminder: number) {
    if (!reminder || reminder < 0 || reminder > 1440 || !Number.isInteger(reminder)) {
      throw new Error('Received reminder is invalid');
    }

    localStorage.setItem("reminder", JSON.stringify(reminder));
  }

  getReminder() {
    const reminder = localStorage.getItem("reminder");
    const reminderNumber = Number(reminder);

    if (!reminderNumber || reminderNumber < 0 || reminderNumber > 1440 || !Number.isInteger(reminderNumber)) {
      throw new Error('Reminder is invalid');
    }

    return reminder;
  }

  // day methods
  addCurrentDay() {
    const date = new Date().getDate();

    if (!date || date <= 0 || date > 31 || !Number.isInteger(date)) {
      throw new Error('Date is invalid');
    }

    localStorage.setItem("currentDay", JSON.stringify(date));
  }

  getCurrentDay() {
    const currentDay = localStorage.getItem("currentDay");
    const currentDayNumber = Number(currentDay);

    if (!currentDayNumber || currentDayNumber <= 0 || currentDayNumber > 31 || !Number.isInteger(currentDayNumber)) {
      throw new Error('Date is invalid');
    }

    return currentDay;
  }

  // cup methods
  addCup(capacity: number, isCustom: boolean) {
    if (!capacity || capacity <= 0 || capacity > Constants.MAX_WATER_TARGET || !Number.isInteger(capacity) ||
      isCustom === undefined || isCustom === null || typeof isCustom !== 'boolean') {
      throw new Error('Invalid cup values');
    }

    let cups = JSON.parse(this.getAllCups()!);

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
  }

  getAllCups() {
    return localStorage.getItem('cups');
  }

  deleteCupById(id: string) {
    const cups: Cup[] = JSON.parse(this.getAllCups()!);

    const newCups = cups.filter(cup => cup.id !== id);

    localStorage.setItem('cups', JSON.stringify(newCups));
  }

  deleteAllData() {
    localStorage.clear();
  }
}