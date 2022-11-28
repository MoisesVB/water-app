import { Injectable } from '@angular/core';
import { ActivityData } from 'src/shared/models/activity';
import { Cup } from 'src/shared/models/cup';

@Injectable({
  providedIn: 'root'
})
export class RecycleBinService {

  lastDeletedItem?: Cup | ActivityData;

  constructor() { }

  setDeletedItem(item: Cup | ActivityData) {
    this.lastDeletedItem = item
    this.resetDeletedItem();
  }

  resetDeletedItem() {
    setTimeout(() => {
      this.lastDeletedItem = undefined;
    }, 10000);
  }
}
