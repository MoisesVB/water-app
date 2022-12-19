import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GoalModalComponent } from './goal-modal/goal-modal.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CardComponent } from './card/card.component';
import { SubmitIntakeComponent } from './submit-intake/submit-intake.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { ActivityModalComponent } from './activity-modal/activity-modal.component';
import { CupModalComponent } from './cup-modal/cup-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { OverlayComponent } from './overlay/overlay.component';
import { ReminderModalComponent } from './reminder-modal/reminder-modal.component';
import { MessageComponent } from './message/message.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { CupIconComponent } from './cup-icon/cup-icon.component';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { SettingsSectionComponent } from './settings-section/settings-section.component';

@NgModule({
  declarations: [
    AppComponent,
    GoalModalComponent,
    ProgressBarComponent,
    CardComponent,
    SubmitIntakeComponent,
    SettingsModalComponent,
    ActivityModalComponent,
    CupModalComponent,
    ModalComponent,
    OverlayComponent,
    ReminderModalComponent,
    MessageComponent,
    ErrorMessageComponent,
    CupIconComponent,
    SuccessMessageComponent,
    AlertMessageComponent,
    ToggleButtonComponent,
    SettingsSectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
