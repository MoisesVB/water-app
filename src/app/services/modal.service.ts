import { Injectable } from '@angular/core';
import { Modal } from './modals/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modals: Modal[] = [];
  queue: Modal[] = [];

  constructor() {
    this.registerAllModals();
  }

  registerAllModals() {
    this.register('goal');
    this.register('reminder');
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

  syncQueue() {
    if (this.queue.length > 0) {
      const toUpdate = this.queue[0];

      this.modals = this.modals.map(modal => {
        if (modal.id === toUpdate.id) {
          modal.visible = toUpdate.visible;
        }

        return modal;
      });

      this.queue = this.queue.filter(q => q.id !== toUpdate.id);
    }
  }

  setVisibility(id: string, visible: boolean) {
    const modal = this.modals.find(modal => modal.id === id);

    if (!modal) {
      throw new Error('Modal not found');
    }

    this.syncQueue();

    const activeModal = this.modals.find(modal => modal.visible && modal.id !== id);

    if (activeModal && visible) {
      this.queue.push({ id, visible });
      return;
    }

    this.modals = this.modals.map(modal => {
      if (modal.id === id) {
        modal.visible = visible;
      }

      return modal;
    });
  }

  unregister() { }

  unregisterAll() {
    this.modals = [];
  }
}
