import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { Cup } from '../shared/models/cup';
import { Activity, ActivityData } from '../shared/models/activity';
import { ProcessData } from './models/process-data';
import { StoreLocalService } from './services/store-local.service';
import { UserData } from './models/user-data';
import { Constants } from './constants';
import { ModalService } from './services/modal.service';
import { MessageService } from './services/message.service';
import { CupIcon } from 'src/shared/models/cup-icon';
import { RecycleBinService } from './services/recycle-bin.service';
import { Goal } from 'src/shared/models/goal';

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
    goal: {},
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
    countUpInterval: undefined,
    isDeletingIntake: false,
    notification: undefined
  }

  constructor(
    public service: StoreLocalService,
    private modalService: ModalService,
    private messageService: MessageService,
    private recycleBinService: RecycleBinService
  ) { }

  ngOnInit() {
    this.handleInitialModals();

    // setInterval(() => {
    //   this.processData.notification = new Notification("Drink Water!", {
    //     body: "Drink water to stay healthy!",
    //     requireInteraction: true,
    //     tag: 'water'
    //   });
    // }, 5000)
  }

  @HostListener('window:unload')
  closeNotifications() {
    this.processData.notification?.close();
    this.processData.notification = undefined;
  }

  handleData() {
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

  setSuccessView(status: boolean, message?: string) {
    this.messageService.setVisibility('success', status, message);
  }

  isSuccessMessageVisible() {
    return this.messageService.isVisible('success');
  }

  setAlertView(status: boolean, message?: string) {
    this.messageService.setVisibility('alert', status, message);
  }

  isAlertMessageVisible() {
    return this.messageService.isVisible('alert');
  }

  handleGoal() {
    let goal: Goal;
    let hasAnyGoal: boolean;

    try {
      goal = this.service.getGoal();
      hasAnyGoal = Object.keys(goal!).length > 0;
    } catch (err) {
      if (err instanceof Error) {
        this.service.removeGoal();
        this.userData.goal = {};
        this.setGoalView(true);
        return;
      }
    }

    if (hasAnyGoal!) {
      this.addGoalLocal(goal!);
      this.setGoalView(false);
    }
  }

  addGoalLocal(goal: Goal) {
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

    if (this.userData.reminder != undefined) {
      this.setSuccessView(true, 'Goal changed successfully!');
    }
  }

  handleCups() {
    let cups: Cup[] = [];

    try {
      cups = this.service.getAllCups();
    } catch (err) {
      if (err instanceof Error) {
        const model = [
          { capacity: 100, icon: CupIcon.ExtraSmall },
          { capacity: 200, icon: CupIcon.Small },
          { capacity: 250, icon: CupIcon.Medium },
          { capacity: 500, icon: CupIcon.Large }
        ];

        const addedCups = model.map(obj => this.service.addCup(obj.capacity, false, obj.icon));
        addedCups.forEach(cup => this.addCupLocal(cup));

        return;
      }
    }

    if (cups.length > 0) {
      cups.forEach(cup => this.addCupLocal(cup));
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

  addCupFromView(obj: any) {
    const capacity = obj.cup;
    const icon = obj.icon;

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

    const addedCup = this.service.addCup(capacityNumber, true, icon);
    this.addCupLocal(addedCup);
    this.setCupView(false);

    this.userData.selectedCup = undefined;

    this.setSuccessView(true, 'Added cup successfully!');
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

    this.recycleBinService.setDeletedItem(deletedCup);
    this.setAlertView(true, 'Custom cup deleted!');
  }

  recoverCup() {
    const { capacity, isCustom, icon, id } = this.recycleBinService.lastDeletedItem as Cup;

    const cups = this.service.getAllCups();
    const foundDuplicate = cups.find(cup => cup.capacity === capacity);

    try {
      if (foundDuplicate) {
        throw new Error('Failed to recover cup, cup is duplicated');
      }
    } catch (err) {
      this.setErrorView(true, 'Failed to recover cup, cup is duplicated');
      return;
    }

    const addedCup = this.service.recoverCup(id, capacity, isCustom, icon as CupIcon);
    this.addCupLocal(addedCup);

    this.userData.selectedCup = undefined;

    this.setSuccessView(true, 'Recovered cup successfully!');
  }

  isCup(item: any): item is Cup {
    return (<Cup>item).capacity !== undefined;
  }

  isActivity(item: any): item is ActivityData {
    return (<ActivityData>item).intake !== undefined;
  }

  recover() {
    const item = this.recycleBinService.lastDeletedItem;

    if (this.isCup(item)) {
      this.recoverCup();
    } else {
      this.recoverActivity();
    }
  }

  handleIntake() {
    let intake: number | undefined;

    try {
      intake = this.getDayIntake();
    } catch (err) {
      if (err) {
        this.addIntakeLocal(0);
      }
    }

    if (intake) {
      this.addIntakeLocal(intake);
      this.setProgressBarPercentage();
    }
  }

  getDayIntake() {
    let todayDate = new Date().toLocaleDateString();

    let activity: Activity;
    let todayActivity: ActivityData[];

    try {
      activity = this.service.getAllActivity();
      todayActivity = activity[todayDate];
    } catch (err) {
      return 0;
    }

    if (!todayActivity || todayActivity.length === 0) {
      return 0;
    }

    return todayActivity.reduce((acc, obj) => acc + obj.intake, 0);
  }

  addIntakeLocal(intake: number) {
    this.userData.intake = intake;
  }

  handleReminder() {
    let reminder: number | undefined;

    try {
      reminder = this.service.getReminder();
    } catch (err) {
      if (err instanceof Error) {
        this.setReminderView(true);
      }
    }

    if (reminder) {
      this.addReminderLocal(reminder);
      this.setReminderView(false);

      // if reminder and goal are set then continue...
      this.handleData();
    }
  }

  addReminderLocal(reminder: number) {
    this.userData.reminder = reminder;
  }

  handleActivity() {
    let activity: Activity | undefined;

    try {
      activity = this.service.getAllActivity();
    } catch (err) {
      if (err instanceof Error) {
        return;
      }
    }

    if (activity) {
      this.addActivityLocal(activity);
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
      this.processData.notification = new Notification("Drink Water!", {
        body: "Drink water to stay healthy!",
        requireInteraction: true,
        tag: 'water'
      });

      // go to tab when clicking notification
      this.processData.notification.onclick = () => {
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

    this.setSuccessView(true, 'Setup complete, enjoy the app!');
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

      this.userData.activity[`${date}`] = this.userData.activity[`${date}`].sort((a, b) => {
        return a.hour.slice(0, -2).trim().localeCompare(b.hour.slice(0, -2).trim());
      });
    }
  }

  addIntakeFromView() {
    // if a cup is selected and there's not a count up occurring
    if (this.userData.selectedCup && !this.processData.countUpInterval) {
      const tempCup = this.userData.cups?.find((cup: Cup) => cup.id === this.userData.selectedCup);

      if (tempCup?.capacity! + this.userData.intake > Constants.MAX_WATER_TARGET) {
        const leftIntake = Constants.MAX_WATER_TARGET - this.userData.intake;

        if (leftIntake > 0) {
          const addedActivity = this.service.addActivity(leftIntake);
          this.updateActivityLocal(addedActivity);
        } else {
          return;
        }
      } else {
        const addedActivity = this.service.addActivity(tempCup?.capacity!);
        this.updateActivityLocal(addedActivity);
      }

      // push local intake to be the same as activity
      const desiredIntake = this.getDayIntake();

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

  countDown(desiredIntake: number) {
    const cupSize = this.userData.intake - desiredIntake;
    let multiplier = Math.ceil((cupSize * 0.02)); // get 2 percent and round up number

    const interval = window.setInterval(() => {
      this.userData.intake -= multiplier;

      if (this.userData.intake === desiredIntake) {
        clearInterval(interval);

        this.setProgressBarPercentage();
      } else if (this.userData.intake < desiredIntake) {
        clearInterval(interval);

        this.userData.intake = desiredIntake;
        this.setProgressBarPercentage();
      }
    }, 10)
  }

  getMostRecentGoal(): number {
    let arr = Object.keys(this.userData.goal).sort((a, b) => +new Date(a) - +new Date(b));
    arr = arr.reverse(); // recent to oldest

    return this.userData.goal[arr[0]];
  }

  setProgressBarPercentage() {
    const formula = (this.userData.intake * 100) / this.getMostRecentGoal();

    const result = formula >= 100 ? 100 : formula;

    const formattedResult = result.toFixed(0); // no decimals

    let difference = -(this.processData.progressBarPercentage - Number(formattedResult)); // inverts the result
    /* 
    difference -> if the number is positive then the progress bar needs to increase 
    difference -> if the number is negative then the progress bar needs to decrease 

    Example:

    current    ->  60%
    target     ->  40%
    difference ->  20% -> -20%

    current    ->  40%
    target     ->  60%
    difference -> -20% ->  20%
    */

    let speed = 30;

    // the amount of change needed to progress bar (always a positive value)
    const positiveValue = Math.abs(difference);

    // speed is set only once
    if (positiveValue >= 80) {
      speed = 5;
    } else if (positiveValue >= 60) {
      speed = 10;
    } else if (positiveValue >= 40) {
      speed = 15;
    } else if (positiveValue >= 20) {
      speed = 20;
    }

    const interval = setInterval(() => {
      if (difference > 0) {
        this.processData.progressBarPercentage++;
        difference--;
      } else if (difference < 0) {
        this.processData.progressBarPercentage--;
        difference++;
      } else {
        clearInterval(interval);
      }
    }, speed)

    // this.processData.progressBarPercentage = Number(formattedResult);
  }

  toggleDeletingProcess() {
    this.processData.isDeletingIntake = !this.processData.isDeletingIntake;
  }

  deleteActivityFromView(activity: ActivityData) {
    if (this.processData.isDeletingIntake) {
      return;
    }

    this.toggleDeletingProcess();

    const deletedActivity = this.service.deleteActivityById(activity.id);
    this.countDown(this.getDayIntake());

    for (let key in this.userData.activity) {
      this.userData.activity[key] = this.userData.activity[key].filter(obj => obj.id !== activity.id);

      if (this.userData.activity[key].length <= 0) {
        delete this.userData.activity[key];
      }
    }

    // to delay toggle, to not affect progress bar
    const interval = setInterval(() => {
      this.toggleDeletingProcess();

      clearInterval(interval);
    }, 450)

    this.recycleBinService.setDeletedItem(deletedActivity);
    this.setAlertView(true, 'Activity deleted!');
  }

  recoverActivity() {
    const { id, hour, intake } = this.recycleBinService.lastDeletedItem as ActivityData;

    if (intake + this.userData.intake > Constants.MAX_WATER_TARGET) {
      const leftIntake = Constants.MAX_WATER_TARGET - this.userData.intake;

      if (leftIntake > 0) {
        const addedActivity = this.service.recoverActivity(this.recycleBinService.lastDeletedItem as ActivityData);
        this.updateActivityLocal(addedActivity);
      } else {
        return;
      }
    } else {
      const addedActivity = this.service.recoverActivity(this.recycleBinService.lastDeletedItem as ActivityData);
      this.updateActivityLocal(addedActivity);
    }

    // push local intake to be the same as activity
    const desiredIntake = this.getDayIntake();

    this.countUp(desiredIntake);

    this.setSuccessView(true, 'Recovered activity successfully!');
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
    this.userData.goal = {};
    this.userData.intake = 0;
    this.userData.selectedCup = undefined;
    this.userData.activity = {};
    this.userData.currentDay = undefined;
    this.userData.cups = undefined;
    this.userData.reminder = undefined;

    this.processData.reminderIntervals = [];
    this.processData.progressBarPercentage = 0;

    this.processData.notification?.close();
    this.processData.notification = undefined;

    this.handleInitialModals();
  }
}
