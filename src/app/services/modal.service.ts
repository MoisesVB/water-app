import { Injectable } from '@angular/core';
import { Modal } from '../modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modals: Modal[] = [];

  constructor() {
    this.register('goal');
    this.register('settings');
    this.register('activity');
    this.register('cup');
  }

  register(id: string) {
    this.modals.push({ id, visible: false });
  }

  isVisible(id: string) {
    const modal = this.modals.find(modal => modal.id === id);

    if (!modal) {
      throw new Error('Modal not found');
    }

    return modal.visible;
  }

  setVisibility(id: string, visible: boolean) {
    const modal = this.modals.find(modal => modal.id === id);

    if (!modal) {
      throw new Error('Modal not found');
    }

    this.modals = this.modals.map(modal => {
      if (modal.id === id) {
        modal.visible = visible;
      }

      return modal;
    });
  }

  unregister() { }
  unregisterAll() { }
}
