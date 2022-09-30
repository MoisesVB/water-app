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
    service.register('recover');

    expect(service.messages.length).toBe(2);
    expect(service.messages[1].id).toBe('recover');
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
});
