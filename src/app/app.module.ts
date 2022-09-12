import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GoalModalComponent } from './goal-modal/goal-modal.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CardComponent } from './card/card.component';
import { SubmitIntakeComponent } from './submit-intake/submit-intake.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { LogModalComponent } from './log-modal/log-modal.component';
import { CupModalComponent } from './cup-modal/cup-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    GoalModalComponent,
    ProgressBarComponent,
    CardComponent,
    SubmitIntakeComponent,
    SettingsModalComponent,
    LogModalComponent,
    CupModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
