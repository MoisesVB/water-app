import { Injectable } from '@angular/core';
import { ActivityData } from 'src/shared/models/activity';
import { Cup } from 'src/shared/models/cup';

@Injectable({
  providedIn: 'root'
})
export class RecycleBinService {

  interval?: number;

  lastDeletedItem?: Cup | ActivityData;

  constructor() { }

  setDeletedItem(item: Cup | ActivityData) {
    clearInterval(this.interval);
    this.lastDeletedItem = item
    this.resetDeletedItem();
  }

  resetDeletedItem() {
    this.interval = window.setTimeout(() => {
      this.lastDeletedItem = undefined;
    }, 10000);
  }
}
