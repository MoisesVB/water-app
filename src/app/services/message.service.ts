import { Injectable } from '@angular/core';
import { Message } from './modals/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  queue: Message[] = [];

  // there's only one type of message for each category
  // new categories with same id cannot be added
  // example: [{ id: 'error' }, { id: 'warning' }]
  // not: [{ id: 'error' }, { id: 'error' }]

  constructor() {
    this.register('error');
  }

  register(id: string) {
    if (Number(id) || !id) {
      throw new Error('Invalid id');
    }

    const idAlreadyExists = this.messages.find(msg => msg.id === id);

    if (idAlreadyExists) {
      throw new Error('Id already exists');
    }

    this.messages.push({ id, visible: false });

    const addedMessage = this.messages.find(msg => msg.id === id);

    return addedMessage;
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

  updateMessage(id: string, visible: boolean, message?: string) {
    if (visible && !message) {
      throw new Error('Message description not set');
    }

    const toUpdate = this.messages.find(msg => msg.id === id);

    if (!toUpdate) {
      throw new Error('Message not found');
    }

    this.messages = this.messages.map(msg => {
      if (msg.id === id) {
        msg.visible = visible;
        msg.message = message;
      }

      return msg;
    });

    const updatedMessage = this.messages.find(msg => msg.id === id);

    return updatedMessage;
  }

  removeFromQueue(id: string) {
    const toRemove = this.queue.find(msg => msg.id === id);

    if (!toRemove) {
      throw new Error('Message not found');
    }

    this.queue = this.queue.filter(q => q.id !== toRemove.id);

    return toRemove;
  }

  syncQueueAndMessage() {
    if (this.queue.length > 0) {
      const toUpdate = this.queue[0];
      const { id, visible, message } = toUpdate;

      const updatedMessage = this.updateMessage(id, visible, message!);

      const deletedMessage = this.removeFromQueue(id);

      return { updated: updatedMessage, deleted: deletedMessage };
    }

    return;
  }

  addToQueue(id: string, visible: boolean, message: string) {
    const messageExists = this.queue.find(msg => msg.id === id);

    if (messageExists) {
      throw new Error('Message already exists');
    }

    if (!message) {
      throw new Error('Message description is not set');
    }

    this.queue.push({ id, visible, message });

    const addedMessage = this.queue.find(q => q.id === id);

    return addedMessage;
  }

  setVisibility(id: string, visible: boolean, message?: string) {
    const messageExists = this.messages.find(msg => msg.id === id);

    if (!messageExists) {
      throw new Error('Message not found');
    }

    this.syncQueueAndMessage();

    const activeModal = this.messages.find(msg => msg.visible && msg.id !== id);

    if (activeModal && visible) {
      this.addToQueue(id, visible, message!);
      return;
    }

    return this.updateMessage(id, visible, message);
  }

  unregister(id: string) {
    const toUnregister = this.messages.find(msg => msg.id === id);

    if (!toUnregister) {
      throw new Error('Message not found');
    }

    this.messages = this.messages.filter(msg => msg.id !== id);

    return toUnregister;
  }
}
