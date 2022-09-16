import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ConfigData } from './config-data';
import { Cup } from './cup';
import { ActivityData } from './activity';
import { ProcessData } from './process-data';
import { StoreLocalService } from './store-local.service';
import { UserData } from './user-data';
import { Constants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('focusBlur', [
      state('focus', style({
        opacity: 1,
      })),
      state('blur', style({
        opacity: 0.1,
      })),
      transition('focus => blur', [
        animate(300)
      ]),
      transition('blur => focus', [
        animate(300)
      ])
    ]),
    trigger('leaveEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  constructor(
    public service: StoreLocalService
  ) { }

  ngOnInit() {
    this.handleDate();
    this.loadGoal();
    this.handleCups();
    this.loadIntake();
    this.loadReminder();
    this.requestNotificationPermission();
  }

  handleDate() {
    const storedDay = parseInt(this.service.getCurrentDay()!);
    const today = new Date().getDate();

    // if there's a day stored and this day is outdated
    if (storedDay && storedDay !== today) {
      // clear intake because it's another day

      // restoring intake to 0
      this.service.deleteIntake(parseInt(this.service.getIntake()!));

      // update day to today
      this.service.addCurrentDay();
    } else { // if there's no day stored
      this.service.addCurrentDay();
    }
  }

  loadGoal() {
    const goal = this.service.getGoal();

    if (goal) {
      this.defineGoal(goal);
    }
  }

  loadIntake() {
    const intake = this.service.getIntake();

    if (intake) {
      this.userData.intake = parseInt(intake);
      this.setProgressBarPercentage();
    }
  }

  loadReminder() {
    const reminder = this.service.getReminder();

    if (reminder) {
      this.userData.selectedReminder = parseInt(reminder);
    } else {
      this.service.addReminder(60);
      this.userData.selectedReminder = 60;
    }
  }

  handleCups() {
    if (this.service.getAllCups()) {
      this.loadCups();
    } else {
      this.service.addCup(100, false);
      this.service.addCup(200, false);
      this.service.addCup(250, false);
      this.service.addCup(500, false);

      this.loadCups();
    }
  }

  loadCups() {
    this.cupsInfo = this.service.getAllCups();
  }

  addCup(capacity: string) {
    this.service.addCup(parseInt(capacity), true);
    this.loadCups();
    this.userData.selectedCup = undefined;
  }

  deleteCup(id: string) {
    this.service.deleteCupById(id);
    this.loadCups();
  }

  requestNotificationPermission() {
    Notification.requestPermission().then(() => {
      this.notifyMe();
    });
  }

  notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      this.intervalNotify();

    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.intervalNotify();
        }
      });
    }
  }

  intervalNotify() {
    const interval = window.setInterval(() => {
      const notification = new Notification("Drink Water!", { body: "Drink water to stay healthy!", requireInteraction: true });

      // go to tab when clicking notification
      notification.onclick = () => {
        window.focus();
      }
    }, 1000 * 60 * this.userData.selectedReminder)

    this.processData.reminderIntervals?.push(interval);
    // 1000 * 60 * ${desired minutes}
  }

  userData: UserData = {
    goal: 0,
    intake: 0,
    selectedCup: undefined,
    selectedReminder: 0,
  }

  processData: ProcessData = {
    progressBarPercentage: 0,
    reminderIntervals: [],
    countUpInterval: undefined
  }

  configData: ConfigData = {
    isGoalDefined: false,
    isSettingsOpen: false,
    isLogOpen: false,
    isCupModalOpen: false
  }

  toggleCupModal() {
    this.configData.isCupModalOpen = !this.configData.isCupModalOpen;
  }

  toggleSettings() {
    this.configData.isSettingsOpen = !this.configData.isSettingsOpen;
  }

  toggleLog() {
    this.configData.isLogOpen = !this.configData.isLogOpen;
  }

  changeGoals() {
    this.toggleSettings();
    this.configData.isGoalDefined = false;
  }

  changeReminder(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.userData.selectedReminder = parseInt(value);

    // store reminder value in localstorage
    this.service.addReminder(this.userData.selectedReminder);

    this.processData.reminderIntervals?.map(item => clearInterval(item)); // remove intervals in array
    this.processData.reminderIntervals = []; // empty array after

    this.intervalNotify(); // set interval again for the new updated value
  }

  cupsInfo: Cup[] = [];

  defineGoal(goal: string) {
    const goalNumber = parseInt(goal);

    this.service.addGoal(goalNumber);

    this.userData.goal = goalNumber;
    this.configData.isGoalDefined = true;

    this.setProgressBarPercentage();
  }

  handleClick(cupId: string) {
    // toggle selected status of clicked cup
    this.cupsInfo = this.cupsInfo.map((cup: Cup) => {
      // if the clicked cup is not already selected then assign it as selected
      if (cup.id === cupId) {
        this.userData.selectedCup = cupId;
      }

      return cup;
    })
  }

  addIntake() {
    // if a cup is selected and there's not a count up occurring
    if (this.userData.selectedCup && !this.processData.countUpInterval) {
      const tempCup = this.cupsInfo.find((cup: Cup) => cup.id === this.userData.selectedCup);

      if (tempCup?.capacity! + this.userData.intake > Constants.MAX_WATER_TARGET) {
        const leftIntake = Constants.MAX_WATER_TARGET - this.userData.intake;

        if (leftIntake > 0) {
          // store to localstorage
          this.service.addIntake(leftIntake);
          this.service.addActivity(leftIntake);
        } else {
          return;
        }
      } else {
        this.service.addIntake(tempCup?.capacity!);
        this.service.addActivity(tempCup?.capacity!);
      }

      // push local intake to be the same as stored
      const desiredIntake = parseInt(this.service.getIntake()!);

      this.countUp(desiredIntake);
    }
  }

  countUp(desiredIntake: number) {
    const cupSize = desiredIntake - this.userData.intake;
    let multiplier = Math.ceil((cupSize * 0.02)); // get 2 percent and round up number

    this.processData.countUpInterval = window.setInterval(() => {
      this.userData.intake += multiplier;

      if (this.userData.intake === desiredIntake) {
        clearInterval(this.processData.countUpInterval);
        this.processData.countUpInterval = undefined;

        this.setProgressBarPercentage();
      } else if (this.userData.intake > desiredIntake) {
        clearInterval(this.processData.countUpInterval);
        this.processData.countUpInterval = undefined;

        this.userData.intake = desiredIntake;
        this.setProgressBarPercentage();
      }
    }, 10)
  }

  setProgressBarPercentage() {
    const formula = (this.userData.intake * 100) / this.userData.goal;

    this.processData.progressBarPercentage = formula >= 100 ? 100 : formula;
  }

  deleteActivity(activity: ActivityData) {
    this.service.deleteActivityById(activity.id);
    this.deleteIntake(activity.intake);
  }

  deleteIntake(intake: number) {
    this.service.deleteIntake(intake);

    // push local intake to be the same as stored
    this.userData.intake = parseInt(this.service.getIntake()!);
    this.setProgressBarPercentage();
  }

  deleteData() {
    this.service.deleteAllData();

    // reset all variables here
    this.userData.goal = 0;
    this.userData.intake = 0;
    this.userData.selectedCup = undefined;

    this.processData.reminderIntervals = [];
    this.processData.progressBarPercentage = 0;

    this.configData.isGoalDefined = false;
    this.configData.isSettingsOpen = false;
    this.configData.isLogOpen = false;
    this.configData.isCupModalOpen = false;
    this.cupsInfo = [];

    this.handleDate();
    this.loadGoal();
    this.handleCups();
    this.loadIntake();
    this.loadReminder();
    this.requestNotificationPermission();
  }
}
