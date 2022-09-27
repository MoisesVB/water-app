import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  animations: [
    trigger('leaveEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 0.9 }))
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class OverlayComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void { }

  @Input() modalId!: string;

  @HostListener('document:keydown.escape', ['$event'])
  closeModalOnEsc() {
    try {
      if (this.modalService.isVisible(this.modalId)) {
        this.closeModal();
      }
    } catch (err) { }
  }

  isVisible() {
    try {
      return this.modalService.isVisible(this.modalId);
    } catch (err) {
      return false;
    }
  }

  closeModal() {
    this.modalService.setIsVisible(this.modalId, false);
  }
}
