import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
})
export class SuccessMessageComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.destroyCounter();
  }

  destroyCounter() {
    setTimeout(() => {
      this.closeMessage();
    }, 5000);
  }

  getMessage() {
    return this.messageService.getMessage('success');
  }

  closeMessage() {
    this.messageService.setVisibility('success', false);
  }
}
