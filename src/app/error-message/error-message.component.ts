import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent implements OnInit, OnDestroy {

  interval?: number;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.destroyCounter();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  destroyCounter() {
    this.interval = window.setTimeout(() => {
      this.closeMessage();
    }, 5000);
  }

  getMessage() {
    return this.messageService.getMessage('error');
  }

  closeMessage() {
    this.messageService.setVisibility('error', false);
  }
}
