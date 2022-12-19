import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent {
  @Input() outerWidth?: number;
  @Input() innerWidth?: number;
  @Input() height?: number;
  @Input() isOn?: boolean;
  @Input() disabled?: boolean;

  @Output() action = new EventEmitter<boolean>();

  toggle() {
    if (this.disabled) return;

    this.action.emit(!this.isOn);
  }
}
