import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Activity, ActivityData } from '../../shared/models/activity';
import { Constants } from '../constants';
import { Cup } from '../../shared/models/cup';
import { CupIcon } from 'src/shared/models/cup-icon';
import { Goal } from 'src/shared/models/goal';

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
  addGoal(goal: number): Goal {
    if (goal <= 0 || goal > Constants.MAX_WATER_TARGET || !Number.isInteger(goal)) {
      throw new Error('Received goal is invalid');
    }

    let goalHistory: Goal;

    try {
      goalHistory = this.getGoal();
    } catch (err) {
      goalHistory = {};
    }

    const todaysDate = new Date().toLocaleDateString();
    goalHistory[todaysDate] = goal;

    localStorage.setItem("goal", JSON.stringify(goalHistory));

    return goalHistory;
  }

  getGoal(): Goal {
    let goal: Goal;

    try {
      goal = JSON.parse(localStorage.getItem("goal")!);
    } catch (err) {
      throw new Error('Goal is invalid');
    }

    if (Object.keys(goal).length === 0) {
      throw new Error('Goal is invalid');
    }

    Object.keys(goal).forEach(g => {
      if (typeof (g) !== 'string' || goal[g] <= 0 || goal[g] > Constants.MAX_WATER_TARGET || !Number.isInteger(goal[g])) {
        throw new Error('Goal is invalid');
      }
    });

    return goal;
  }

  removeGoal() {
    localStorage.removeItem('goal');
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

  recoverActivity(activityData: ActivityData) {
    let activity: Activity | undefined;

    try {
      activity = this.getAllActivity();
    } catch (err) {
      activity = undefined;
    }

    const date = new Date().toLocaleDateString();

    if (!activity) {
      activity = {};
    }

    if (!activity.hasOwnProperty(`${date}`)) {
      activity[`${date}`] = [activityData]
    } else if (activity.hasOwnProperty(`${date}`)) {
      activity[`${date}`].push(activityData);

      activity[`${date}`] = activity[`${date}`].sort((a, b) => {
        return a.hour.slice(0, -2).trim().localeCompare(b.hour.slice(0, -2).trim());
      });
    }

    const pushedActivity = activity[`${date}`].find((act: ActivityData) => act === activityData);

    if (!activity || !activity.hasOwnProperty(`${date}`) || activity[`${date}`].length <= 0 || !pushedActivity) {
      throw new Error('Error in recovering activity');
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

  // cup methods
  addCup(capacity: number, isCustom: boolean, icon: CupIcon) {
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
      isCustom: isCustom,
      icon: icon
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

  recoverCup(id: string, capacity: number, isCustom: boolean, icon: CupIcon) {
    let cups: Cup[] | undefined;

    try {
      cups = this.getAllCups();
    } catch (err) {
      cups = undefined;
    }

    const recoveredCup: Cup = {
      id,
      capacity,
      isCustom,
      icon
    }

    if (!cups) {
      cups = [];
    }

    cups.push(recoveredCup);

    const pushedCup = cups.find((cup: Cup) => cup === recoveredCup);

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
      if (this.cupIsInvalid(cup)) {
        throw new Error('Invalid cup found');
      }
    })

    return cups;
  }

  // TODO: create tests
  cupIsInvalid(cup: Cup) {
    const idIsInvalid = !cup.id || typeof cup.id !== 'string';
    const isCapacityInvalid = !cup.capacity || cup.capacity <= 0 || cup.capacity > Constants.MAX_WATER_TARGET || !Number.isInteger(cup.capacity);
    const isCustomInvalid = cup.isCustom === undefined || cup.isCustom === null || typeof cup.isCustom !== 'boolean';

    const iconIsEnum = Object.values(CupIcon).includes(cup.icon as CupIcon);
    const isIconInvalid = !cup.icon || !iconIsEnum;

    return idIsInvalid || isCapacityInvalid || isCustomInvalid || isIconInvalid;
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
    if (!localStorage.getItem('goal') && !localStorage.getItem('intake') && !localStorage.getItem('cups') && !localStorage.getItem('reminder') && !localStorage.getItem('activity')) {
      throw new Error('LocalStorage is empty');
    }

    localStorage.clear();

    if (localStorage.getItem('goal') || localStorage.getItem('intake') || localStorage.getItem('cups') || localStorage.getItem('reminder') || localStorage.getItem('activity')) {
      throw new Error('LocalStorage is not empty');
    }

    return true;
  }

  // remindIfGoalAchieved methods
  addRemindIfGoalAchieved(state: boolean): boolean {
    localStorage.setItem("remindIfGoalAchieved", JSON.stringify(state));

    return state;
  }

  getRemindIfGoalAchieved(): boolean {
    let remindIfGoalAchieved: boolean;

    try {
      remindIfGoalAchieved = JSON.parse(localStorage.getItem("remindIfGoalAchieved")!);
    } catch (err) {
      throw new Error('Value is invalid');
    }

    if (typeof (remindIfGoalAchieved) !== 'boolean') {
      throw new Error('Value is invalid');
    }

    return remindIfGoalAchieved;
  }

  // notificationStatus methods
  addNotificationStatus(state: boolean): boolean {
    localStorage.setItem("notificationStatus", JSON.stringify(state));

    return state;
  }

  getNotificationStatus(): boolean {
    let notificationStatus: boolean;

    try {
      notificationStatus = JSON.parse(localStorage.getItem("notificationStatus")!);
    } catch (err) {
      throw new Error('Value is invalid');
    }

    if (typeof (notificationStatus) !== 'boolean') {
      throw new Error('Value is invalid');
    }

    return notificationStatus;
  }
}