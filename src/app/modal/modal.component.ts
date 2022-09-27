import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  animations: [
    trigger('leaveEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void { }

  @Input() modalId!: string;

  isVisible() {
    try {
      return this.modalService.isVisible(this.modalId);
    } catch (err) {
      return false;
    }
  }
}
