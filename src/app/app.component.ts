import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ConfigData } from './config-data';
import { Cup } from './cup';
import { Activity, ActivityData } from './activity';
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
    this.handleGoal();
    this.handleCups();
    this.handleIntake();
    this.handleReminder();
    this.handleActivity();
    this.requestNotificationPermission();
  }

  handleDate() {
    let storedDay;

    try {
      storedDay = this.getCurrentDay();
    } catch (err) {
      if (err instanceof Error && err.message === 'Date is invalid') {
        const day = this.service.addCurrentDay();
        this.addCurrentDayLocal(day);
      }
    }

    const today = new Date().getDate();

    if (storedDay) {
      if (storedDay !== today) {
        // clear intake because it's another day
        this.service.deleteIntake(this.service.getIntake());

        // update day to today
        const day = this.service.addCurrentDay();
        this.addCurrentDayLocal(day);
      }

      this.addCurrentDayLocal(storedDay);
    }
  }

  getCurrentDay() {
    try {
      return this.service.getCurrentDay();
    } catch (err) {
      throw err;
    }
  }

  addCurrentDayLocal(day: number) {
    this.userData.currentDay = day;
  }

  handleGoal() {
    let goal;

    try {
      goal = this.getGoal();
    } catch (err) {
      if (err instanceof Error && err.message === 'Goal is invalid') {
        this.setGoalView(true);
      }
    }

    if (goal) {
      this.addGoalLocal(goal);
      this.setGoalView(false);
    }
  }

  getGoal() {
    try {
      return this.service.getGoal();
    } catch (err) {
      throw err;
    }
  }

  addGoalLocal(goal: number) {
    this.userData.goal = goal;

    this.setProgressBarPercentage();
  }

  setGoalView(status: boolean) {
    this.configData.isGoalModalOpen = status;
  }

  addGoalFromView(goal: string) {
    const goalNumber = Number(goal);

    const addedGoal = this.service.addGoal(goalNumber);
    this.addGoalLocal(addedGoal);
    this.setGoalView(false);
  }

  handleCups() {
    let cups: Cup[] = [];

    try {
      cups = this.getAllCups();
    } catch (err) {
      if (err instanceof Error) {
        const addedCups = [100, 200, 250, 500].map(capacity => this.service.addCup(capacity, false));
        addedCups.forEach(cup => this.addCupLocal(cup));

        return;
      }
    }

    if (cups.length > 0) {
      cups.forEach(cup => this.addCupLocal(cup));
    }
  }

  getAllCups() {
    try {
      return this.service.getAllCups();
    } catch (err) {
      throw err;
    }
  }

  addCupLocal(cup: Cup) {
    this.cupsInfo.push(cup);
  }

  setCupView(status: boolean) {
    this.configData.isCupModalOpen = status;
  }

  addCupFromView(capacity: string) {
    const capacityNumber = Number(capacity);

    const addedCup = this.service.addCup(capacityNumber, true);
    this.addCupLocal(addedCup);
    this.setCupView(false);

    this.userData.selectedCup = undefined;
  }

  deleteCupByIdFromView(id: string) {
    const deletedCup = this.service.deleteCupById(id);
    this.cupsInfo.filter(cup => cup !== deletedCup);
  }

  handleIntake() {
    let intake: number | undefined;

    try {
      intake = this.getIntake();
    } catch (err) {
      if (err instanceof Error) {
        const addedIntake = this.service.addIntake(0);
        this.addIntakeLocal(addedIntake);
      }
    }

    if (intake) {
      this.addIntakeLocal(intake);
      this.setProgressBarPercentage();
    }
  }

  getIntake() {
    try {
      return this.service.getIntake();
    } catch (err) {
      throw err;
    }
  }

  addIntakeLocal(intake: number) {
    this.userData.intake = intake;
  }

  handleReminder() {
    let reminder: number | undefined;

    try {
      reminder = this.getReminder();
    } catch (err) {
      if (err instanceof Error) {
        const addedReminder = this.service.addReminder(60);
        this.addReminderLocal(addedReminder);
      }
    }

    if (reminder) {
      this.addReminderLocal(reminder);
    }
  }

  getReminder() {
    try {
      return this.service.getReminder();
    } catch (err) {
      throw err;
    }
  }

  addReminderLocal(reminder: number) {
    this.userData.selectedReminder = reminder;
  }

  handleActivity() {
    let activity: Activity | undefined;

    try {
      activity = this.getAllActivity();
    } catch (err) {
      if (err instanceof Error) {
        return;
      }
    }

    if (activity) {
      this.addActivityLocal(activity);
    }
  }

  getAllActivity() {
    try {
      return this.service.getAllActivity();
    } catch (err) {
      throw err;
    }
  }

  addActivityLocal(activity: Activity) {
    this.userData.activity = activity;
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
    activity: {},
    currentDay: undefined
  }

  processData: ProcessData = {
    progressBarPercentage: 0,
    reminderIntervals: [],
    countUpInterval: undefined
  }

  configData: ConfigData = {
    isGoalModalOpen: false,
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
    this.configData.isGoalModalOpen = true;
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
      const desiredIntake = this.service.getIntake();

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
    this.userData.intake = this.service.getIntake();
    this.setProgressBarPercentage();
  }

  deleteData() {
    this.service.deleteAllData();

    // reset all variables here
    this.userData.goal = 0;
    this.userData.intake = 0;
    this.userData.selectedCup = undefined;
    this.userData.activity = {};
    this.userData.currentDay = undefined;

    this.processData.reminderIntervals = [];
    this.processData.progressBarPercentage = 0;

    this.configData.isGoalModalOpen = false;
    this.configData.isSettingsOpen = false;
    this.configData.isLogOpen = false;
    this.configData.isCupModalOpen = false;
    this.cupsInfo = [];

    this.handleDate();
    this.handleGoal();
    this.handleCups();
    this.handleIntake();
    this.handleReminder();
    this.requestNotificationPermission();
  }
}
