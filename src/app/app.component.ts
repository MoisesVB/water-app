import { Component, OnInit } from '@angular/core';
import { Cup } from './cup';
import { StoreLocalService } from './store-local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    private service: StoreLocalService
  ) { }

  ngOnInit() {
    const currentDay = parseInt(this.service.findCurrentDay()!);
    const today = new Date().getDate();

    // if there's a day stored and this day is outdated
    if (currentDay && currentDay !== today) {
      // clear intake because it's another day
      this.service.addIntake(0); // putting 0 to intake

      // update day to today
      this.service.addCurrentDay();
    } else { // if there's no day stored
      this.service.addCurrentDay();
    }

    if (this.service.findGoal()) {
      this.defineGoal(parseInt(this.service.findGoal()!));
    }

    if (this.service.findIntake()) {
      this.intake = parseInt(this.service.findIntake()!);
      this.setProgressBarPercentage();
    }

    if (this.service.findReminder()) {
      this.selectedReminder = parseInt(this.service.findReminder()!);
    } else {
      this.service.addReminder(60);
      this.selectedReminder = 60;
    }

    Notification.requestPermission().then((result) => {
      console.log(result);
    });

    this.notifyMe();
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
    }, 1000 * 60 * this.selectedReminder)

    this.intervals?.push(interval);
    // 1000 * 60 * ${desired minutes}
  }

  // properties
  isGoalDefined = false;
  goal: number = 0;
  intake: number = 0;
  selectedCup?: number;
  isSettingsOpen = false;
  selectedReminder = 0;
  intervals?: number[];
  progressBarPercentage: number = 0;

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  changeGoals() {
    this.toggleSettings();
    this.isGoalDefined = false;
  }

  changeReminder(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.selectedReminder = parseInt(value);

    // store reminder value in localstorage
    this.service.addReminder(this.selectedReminder);

    this.intervals?.map(item => clearInterval(item)); // remove intervals in array
    this.intervals = []; // empty array after

    this.intervalNotify(); // set interval again for the new updated value
  }

  cupsInfo: Cup[] = [
    {
      id: 1,
      capacity: 100
    },
    {
      id: 2,
      capacity: 200
    },
    {
      id: 3,
      capacity: 250
    },
    {
      id: 4,
      capacity: 500
    }
  ]

  defineGoal(goal: number) {
    this.isGoalDefined = true;
    this.goal = goal;

    // store to localstorage
    this.service.addGoal(this.goal);
    this.setProgressBarPercentage();
  }

  handleClick(cupId: number) {
    // toggle selected status of clicked cup
    this.cupsInfo = this.cupsInfo.map((cup: Cup) => {
      // if the clicked cup is not already selected then assign it as selected
      if (cup.id === cupId) {
        this.selectedCup = cupId;
      }

      return cup;
    })
  }

  addIntake() {
    const tempCup = this.cupsInfo.find((cup: Cup) => cup.id === this.selectedCup);
    this.intake += tempCup?.capacity!;

    // store to localstorage
    this.service.addIntake(this.intake);
  }

  setProgressBarPercentage() {
    const formula = (this.intake * 100) / this.goal;

    this.progressBarPercentage = formula >= 100 ? 100 : formula;
  }

  deleteData() {
    this.service.destroyAllData();

    // reset all variables here
  }
}
