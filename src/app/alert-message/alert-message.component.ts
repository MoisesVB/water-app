import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
})
export class AlertMessageComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.destroyCounter();
  }

  destroyCounter() {
    setTimeout(() => {
      this.closeMessage();
    }, 10000);
  }

  getMessage() {
    return this.messageService.getMessage('alert');
  }

  closeMessage() {
    this.messageService.setVisibility('alert', false);
  }

  undo() {
    this.closeMessage();
  }
}
