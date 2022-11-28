import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
})
export class AlertMessageComponent implements OnInit, OnDestroy {

  interval?: number;

  constructor(private messageService: MessageService) { }

  @Output() undo = new EventEmitter();

  ngOnInit(): void {
    this.destroyCounter();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  destroyCounter() {
    this.interval = window.setTimeout(() => {
      this.closeMessage();
    }, 10000);
  }

  getMessage() {
    return this.messageService.getMessage('alert');
  }

  closeMessage() {
    this.messageService.setVisibility('alert', false);
  }

  undoAction() {
    this.closeMessage();
    this.undo.emit();
  }
}
