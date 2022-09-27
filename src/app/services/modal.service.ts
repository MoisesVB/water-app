import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modals: { id: string, visible: boolean }[] = [];

  constructor() { }

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

  setIsVisible(id: string, status: boolean) {
    if (!this.isRegistered(id)) {
      this.register(id);
    }

    this.modals = this.modals.map(modal => {
      if (modal.id === id) {
        modal.visible = status;
      }

      return modal;
    });
  }

  isRegistered(id: string) {
    const modal = this.modals.find(modal => modal.id === id);

    return modal ? true : false;
  }

  unregister(id: string) { }

  unregisterAll() {
    this.modals = [];
  }
}
