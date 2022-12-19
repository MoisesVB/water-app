import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-section',
  templateUrl: './settings-section.component.html',
})
export class SettingsSectionComponent {
  @Input() disabled?: boolean;
}
