import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
})
export class ToggleButtonComponent {
  @Input() width?: number;
  @Input() height?: number;
  @Input() isOn?: boolean;

  toggle() {
    this.isOn = !this.isOn;
  }
}
