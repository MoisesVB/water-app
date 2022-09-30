import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register error message in service initialization', () => {
    expect(service.messages.length).toBe(1);
    expect(service.messages[0].id).toBe('error');
  });

  it('#register should push message to array of messages', () => {
    const addedMessage = service.register('recover');

    expect(service.messages.length).toBe(2);
    expect(addedMessage).toEqual({ id: 'recover', visible: false });
  });

  it('#register should throw error if id is a number', () => {
    expect(() => service.register('123.45')).toThrow(new Error('Invalid id'));
  });

  it('#register should throw error if id is falsy', () => {
    expect(() => service.register('')).toThrow(new Error('Invalid id'));
  });

  it('#register should throw error if id is duplicated', () => {
    expect(() => service.register('error')).toThrow(new Error('Id already exists'));
  });

  it('#isVisible should throw error if message with the id is not found', () => {
    service.register('warning');

    expect(() => service.isVisible('recover')).toThrow(new Error('Message not found'));
  });

  it('#isVisible should return if message is visible', () => {
    service.register('warning');

    expect(service.isVisible('warning')).toBeFalse();
  });

  it('#getMessage should throw error if message with the id is not found', () => {
    expect(() => service.getMessage('warning')).toThrow(new Error('Message not found'));
  });

  it('#getMessage should return undefined with message is not set', () => {
    expect(service.getMessage('error')).toBeUndefined();
  });

  it('#getMessage should return message', () => {
    expect(service.setVisibility('error', true, 'Duplicated cups'));

    expect(service.getMessage('error')).toBe('Duplicated cups');
  });

  it('#unregister should throw error if message with the id is not found', () => {
    expect(() => service.unregister('warning')).toThrow(new Error('Message not found'));
  });

  it('#unregister should remove message from the messages array', () => {
    service.register('recover');

    service.unregister('error');
    service.unregister('recover');

    expect(service.messages.length).toBe(0);
  });

  it('#unregister should return removed message', () => {
    expect(service.unregister('error')).toEqual({ id: 'error', visible: false });
  });

  it('#addToQueue should throw error if message already exists', () => {
    service.addToQueue('recover', true, 'Item deleted, click the button to undo changes');

    expect(() => service.addToQueue('recover', true, 'test')).toThrow(new Error('Message already exists'));
  });

  it('#addToQueue should throw error if message description is not set', () => {
    expect(() => service.addToQueue('recover', true, '')).toThrow(new Error('Message description is not set'));
  });

  it('#addToQueue should return added message', () => {
    expect(service.addToQueue('error', true, 'Duplicated cups')).toEqual({ id: 'error', visible: true, message: 'Duplicated cups' });
  });

  it('#updateMessage should throw error if message with the id is not found', () => {
    expect(() => service.updateMessage('recover', true, 'Testing')).toThrow(new Error('Message not found'));
  });

  it('#updateMessage should throw error if message is not set while visible is true', () => {
    expect(() => service.updateMessage('recover', true, '')).toThrow(new Error('Message description not set'));
  });

  it('#updateMessage should return updated message if visible is false and message is undefined', () => {
    expect(service.updateMessage('error', false, undefined)).toEqual({ id: 'error', visible: false, message: undefined });
  });

  it('#updateMessage should return updated message if visible is true and message is set', () => {
    expect(service.updateMessage('error', true, 'An error occurred')).toEqual({ id: 'error', visible: true, message: 'An error occurred' });
  });

  it('#removeFromQueue should throw error if message with id is not found', () => {
    expect(() => service.removeFromQueue('recover')).toThrow(new Error('Message not found'));
  });

  it('#removeFromQueue should return removed message', () => {
    service.addToQueue('warning', true, 'Testing');

    expect(service.removeFromQueue('warning')).toEqual({ id: 'warning', visible: true, message: 'Testing' });
  });

  it('#removeFromQueue should remove message and message should not be on queue array', () => {
    service.addToQueue('warning', true, 'Testing');

    const removedMessage = service.removeFromQueue('warning');

    expect(service.queue).not.toContain(removedMessage);
  });

  it('#syncQueueAndMessage should be undefined when queue is empty', () => {
    expect(service.syncQueueAndMessage()).toBeUndefined();
  });

  it('#syncQueueAndMessage should return updated and deleted message', () => {
    service.register('warning');

    service.addToQueue('warning', true, 'Testing');

    expect(Object.keys(service.syncQueueAndMessage()!).length).toBe(2);
  });

  it('#syncQueueAndMessage should sync only one time each call', () => {
    service.register('warning');
    service.register('recover');

    service.addToQueue('warning', true, 'Testing');
    service.addToQueue('recover', true, 'Testing Test');

    service.syncQueueAndMessage();

    expect(service.queue.length).toBe(1);
  });

  it('#setVisibility should throw error if message with id is not found', () => {
    expect(() => service.setVisibility('warning', true, 'Testing')).toThrow(new Error('Message not found'));
  })

  it('#setVisibility should return updated message', () => {
    expect(service.setVisibility('error', true, 'Testing')).toEqual({ id: 'error', visible: true, message: 'Testing' });
  })

  it('#setVisibility should be undefined when setting visible to true when there is already a message visible', () => {
    service.register('warning');
    service.setVisibility('warning', true, 'Test');

    expect(service.setVisibility('error', true, 'Testing')).toBeUndefined();
  })

  it('#setVisibility should return updated message when visible is false and there is already a message visible', () => {
    service.register('warning');
    service.setVisibility('warning', true, 'Test');

    expect(service.setVisibility('error', false)).toEqual({ id: 'error', visible: false, message: undefined });
  })

  it('#setVisibility should return updated message when visible is true and there is no message visible', () => {
    service.register('warning');
    service.setVisibility('warning', false);

    expect(service.setVisibility('error', true, 'Testing')).toEqual({ id: 'error', visible: true, message: 'Testing' });
  })

  it('#setVisibility should return updated message when visible is false and there is no message visible', () => {
    service.register('warning');
    service.setVisibility('warning', false);

    expect(service.setVisibility('error', false)).toEqual({ id: 'error', visible: false, message: undefined });
  })
});
