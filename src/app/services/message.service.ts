import { Injectable } from '@angular/core';
import { Message } from '../message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  queue: Message[] = [];

  constructor() {
    this.register('error');
  }

  register(id: string) {
    this.messages.push({ id, visible: false });
  }

  isVisible(id: string) {
    const message = this.messages.find(msg => msg.id === id);

    if (!message) {
      throw new Error('Message not found');
    }

    return message.visible;
  }

  getMessage(id: string) {
    const message = this.messages.find(msg => msg.id === id);

    if (!message) {
      throw new Error('Message not found');
    }

    return message.message;
  }

  syncQueue() {
    if (this.queue.length > 0) {
      const toUpdate = this.queue[0];

      this.messages = this.messages.map(msg => {
        if (msg.id === toUpdate.id) {
          msg.visible = toUpdate.visible;
          msg.message = toUpdate.message;
        }

        return msg;
      });

      this.queue = this.queue.filter(q => q.id !== toUpdate.id);
    }
  }

  setVisibility(id: string, visible: boolean, message?: string) {
    const messageExists = this.messages.find(msg => msg.id === id);

    if (!messageExists) {
      throw new Error('Message not found');
    }

    this.syncQueue();

    const activeModal = this.messages.find(msg => msg.visible && msg.id !== id);

    if (activeModal && visible) {
      this.queue.push({ id, visible, message });
      return;
    }

    this.messages = this.messages.map(msg => {
      if (msg.id === id) {
        msg.visible = visible;
        msg.message = message;
      }

      return msg;
    });
  }

  unregister() { }
}
