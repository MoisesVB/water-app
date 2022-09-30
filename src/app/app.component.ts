import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Cup } from './cup';
import { Activity, ActivityData } from './activity';
import { ProcessData } from './process-data';
import { StoreLocalService } from './store-local.service';
import { UserData } from './user-data';
import { Constants } from './constants';
import { ModalService } from './services/modal.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
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
  userData: UserData = {
    goal: 0,
    intake: 0,
    selectedCup: undefined,
    reminder: undefined,
    activity: {},
    currentDay: undefined,
    cups: undefined
  }

  processData: ProcessData = {
    progressBarPercentage: 0,
    reminderIntervals: [],
    countUpInterval: undefined
  }

  constructor(
    public service: StoreLocalService,
    private modalService: ModalService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.handleInitialModals();

    if (this.userData.goal > 0 && this.userData.reminder! > 0) {
      this.handleData();
    }
  }

  handleData() {
    this.handleDate();
    this.handleCups();
    this.handleIntake();
    this.handleActivity();
    this.requestNotificationPermission();
  }

  handleInitialModals() {
    this.handleGoal();
    this.handleReminder();
  }

  isGoalModalVisible() {
    return this.modalService.isVisible('goal');
  }

  isCupModalVisible() {
    return this.modalService.isVisible('cup');
  }

  isActivityModalVisible() {
    return this.modalService.isVisible('activity');
  }

  isSettingsModalVisible() {
    return this.modalService.isVisible('settings');
  }

  isReminderModalVisible() {
    return this.modalService.isVisible('reminder');
  }

  isErrorMessageVisible() {
    return this.messageService.isVisible('error');
  }

  setErrorView(status: boolean, message?: string) {
    this.messageService.setVisibility('error', status, message);
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

        let storedIntake: number | undefined;

        try {
          storedIntake = this.service.getIntake();
        } catch (err) { }

        if (storedIntake) {
          this.service.deleteIntake(storedIntake);
        }

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
    this.modalService.setVisibility('goal', status);
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
    if (!this.userData.cups) {
      this.userData.cups = [];
    }

    this.userData.cups?.push(cup);
  }

  setCupView(status: boolean) {
    this.modalService.setVisibility('cup', status);
  }

  addCupFromView(capacity: string) {
    const capacityNumber = Number(capacity);

    const cups = this.service.getAllCups();
    const foundDuplicate = cups.find(cup => cup.capacity === capacityNumber);

    try {
      if (foundDuplicate) {
        throw new Error('Failed to add cup, cup is duplicated');
      }
    } catch (err) {
      this.setErrorView(true, 'Failed to add cup, cup is duplicated');
      return;
    }

    const addedCup = this.service.addCup(capacityNumber, true);
    this.addCupLocal(addedCup);
    this.setCupView(false);

    this.userData.selectedCup = undefined;
  }

  sortCupsByCapacity(cups: Cup[]) {
    if (cups && cups.length > 0) {
      const arr = cups.sort((a, b) => {
        return a.capacity - b.capacity;
      });

      return arr;
    }

    return;
  }

  deleteCupByIdFromView(id: string) {
    const deletedCup = this.service.deleteCupById(id);
    this.userData.cups = this.userData.cups?.filter(cup => cup.id !== deletedCup.id);
    this.userData.selectedCup = undefined;
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
        this.setReminderView(true);
      }
    }

    if (reminder) {
      this.addReminderLocal(reminder);
      this.setReminderView(false);
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
    this.userData.reminder = reminder;
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
    } else if (Notification.permission === "granted" && this.userData.reminder! > 0) {
      this.intervalNotify();

    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted" && this.userData.reminder! > 0) {
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
    }, 1000 * 60 * this.userData.reminder!)

    this.processData.reminderIntervals?.push(interval);
    // 1000 * 60 * ${desired minutes}
  }

  setSettingsView(status: boolean) {
    this.modalService.setVisibility('settings', status);
  }

  setActivityView(status: boolean) {
    this.modalService.setVisibility('activity', status);
  }

  setReminderView(status: boolean) {
    this.modalService.setVisibility('reminder', status);
  }

  setSettingsAndGoalView() {
    this.setSettingsView(false);
    this.setGoalView(true);
  }

  addReminderFromView(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const valueNumber = Number(value);

    const addedReminder = this.service.addReminder(valueNumber);
    this.userData.reminder = addedReminder;

    this.processData.reminderIntervals?.map(item => clearInterval(item)); // remove intervals in array
    this.processData.reminderIntervals = []; // empty array after

    this.intervalNotify(); // set interval again for the new updated value
  }

  addInitialReminderFromView(reminder: string) {
    const valueNumber = Number(reminder);

    const addedReminder = this.service.addReminder(valueNumber);
    this.userData.reminder = addedReminder;

    this.setReminderView(false);

    this.handleData();
  }

  handleCupClick(cupId: string) {
    // toggle selected status of clicked cup
    this.userData.cups = this.userData.cups?.map((cup: Cup) => {
      // if the clicked cup is not already selected then assign it as selected
      if (cup.id === cupId) {
        this.userData.selectedCup = cupId;
      }

      return cup;
    })
  }

  updateActivityLocal(activity: ActivityData) {
    const date = new Date().toLocaleDateString();

    if (!this.userData.activity) {
      this.userData.activity = {};
    }

    if (!this.userData.activity.hasOwnProperty(`${date}`)) {
      this.userData.activity[`${date}`] = [activity]
    } else if (this.userData.activity.hasOwnProperty(`${date}`)) {
      this.userData.activity[`${date}`].push(activity);
    }
  }

  addIntakeFromView() {
    // if a cup is selected and there's not a count up occurring
    if (this.userData.selectedCup && !this.processData.countUpInterval) {
      const tempCup = this.userData.cups?.find((cup: Cup) => cup.id === this.userData.selectedCup);

      if (tempCup?.capacity! + this.userData.intake > Constants.MAX_WATER_TARGET) {
        const leftIntake = Constants.MAX_WATER_TARGET - this.userData.intake;

        if (leftIntake > 0) {
          // store to localstorage
          this.service.addIntake(leftIntake);
          const addedActivity = this.service.addActivity(leftIntake);
          this.updateActivityLocal(addedActivity);
        } else {
          return;
        }
      } else {
        this.service.addIntake(tempCup?.capacity!);
        const addedActivity = this.service.addActivity(tempCup?.capacity!);
        this.updateActivityLocal(addedActivity);
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

    const result = formula >= 100 ? 100 : formula;

    const formattedResult = result.toFixed(0); // no decimals

    this.processData.progressBarPercentage = Number(formattedResult);
  }

  deleteActivityFromView(activity: ActivityData) {
    this.service.deleteActivityById(activity.id);
    this.deleteIntake(activity.intake);

    for (let key in this.userData.activity) {
      this.userData.activity[key] = this.userData.activity[key].filter(obj => obj.id !== activity.id);

      if (this.userData.activity[key].length <= 0) {
        delete this.userData.activity[key];
      }
    }
  }

  deleteIntake(intake: number) {
    this.service.deleteIntake(intake);

    // push local intake to be the same as stored
    this.userData.intake = this.service.getIntake();
    this.setProgressBarPercentage();
  }

  deleteData() {
    try {
      this.service.deleteAllData();
    } catch (err) {
      if (err instanceof Error) {
        return;
      }
    }

    this.setSettingsView(false);

    // reset all variables here
    this.userData.goal = 0;
    this.userData.intake = 0;
    this.userData.selectedCup = undefined;
    this.userData.activity = {};
    this.userData.currentDay = undefined;
    this.userData.cups = undefined;

    this.processData.reminderIntervals = [];
    this.processData.progressBarPercentage = 0;

    this.handleInitialModals();
  }
}
