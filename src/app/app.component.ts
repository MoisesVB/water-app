import { Component, OnInit } from '@angular/core';
import { ConfigData } from './config-data';
import { Cup } from './cup';
import { HistoryData } from './history';
import { ProcessData } from './process-data';
import { StoreLocalService } from './store-local.service';
import { UserData } from './user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
    const storedDay = parseInt(this.service.findStoredDay()!);
    const today = new Date().getDate();

    // if there's a day stored and this day is outdated
    if (storedDay && storedDay !== today) {
      // clear intake because it's another day

      // restoring intake to 0
      this.service.destroyIntake(parseInt(this.service.findIntake()!));

      // update day to today
      this.service.addCurrentDay();
    } else { // if there's no day stored
      this.service.addCurrentDay();
    }
  }

  loadGoal() {
    const goal = this.service.findGoal();

    if (goal) {
      this.defineGoal(parseInt(goal));
    }
  }

  loadIntake() {
    const intake = this.service.findIntake();

    if (intake) {
      this.userData.intake = parseInt(intake);
      this.setProgressBarPercentage();
    }
  }

  loadReminder() {
    const reminder = this.service.findReminder();

    if (reminder) {
      this.userData.selectedReminder = parseInt(reminder);
    } else {
      this.service.addReminder(60);
      this.userData.selectedReminder = 60;
    }
  }

  handleCups() {
    if (this.service.findCups()) {
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
    this.cupsInfo = this.service.findCups();
  }

  addCup(capacity: string) {
    this.service.addCup(parseInt(capacity), true);
    this.loadCups();
    this.userData.selectedCup = undefined;
  }

  destroyCup(id: string) {
    this.service.destroyCup(id);
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

    this.processData.intervals?.push(interval);
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
    intervals: []
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

    this.processData.intervals?.map(item => clearInterval(item)); // remove intervals in array
    this.processData.intervals = []; // empty array after

    this.intervalNotify(); // set interval again for the new updated value
  }

  cupsInfo: Cup[] = [];

  defineGoal(goal: number) {
    this.configData.isGoalDefined = true;
    this.userData.goal = goal;

    // store to localstorage
    this.service.addGoal(this.userData.goal);
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
    if (this.userData.selectedCup) {
      const tempCup = this.cupsInfo.find((cup: Cup) => cup.id === this.userData.selectedCup);

      // store to localstorage
      this.service.addIntake(tempCup?.capacity!);

      // push local intake to be the same as stored
      this.userData.intake = parseInt(this.service.findIntake()!);
      this.setProgressBarPercentage();
    }
  }

  setProgressBarPercentage() {
    const formula = (this.userData.intake * 100) / this.userData.goal;

    this.processData.progressBarPercentage = formula >= 100 ? 100 : formula;
  }

  deleteHistory(history: HistoryData) {
    this.service.destroyHistory(history.id);
    this.deleteIntake(history.intake);
  }

  deleteIntake(intake: number) {
    this.service.destroyIntake(intake);

    // push local intake to be the same as stored
    this.userData.intake = parseInt(this.service.findIntake()!);
    this.setProgressBarPercentage();
  }

  deleteData() {
    this.service.destroyAllData();

    // reset all variables here
    this.userData.goal = 0;
    this.userData.intake = 0;
    this.userData.selectedCup = undefined;

    this.processData.intervals = [];
    this.processData.progressBarPercentage = 0;

    this.configData.isGoalDefined = false;
    this.configData.isSettingsOpen = false;
    this.cupsInfo = [];

    this.handleDate();
    this.loadGoal();
    this.handleCups();
    this.loadIntake();
    this.loadReminder();
    this.requestNotificationPermission();
  }
}
