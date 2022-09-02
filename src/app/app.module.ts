import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GoalModalComponent } from './goal-modal/goal-modal.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CardComponent } from './card/card.component';
import { SubmitIntakeComponent } from './submit-intake/submit-intake.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    GoalModalComponent,
    ProgressBarComponent,
    CardComponent,
    SubmitIntakeComponent,
    SettingsModalComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
