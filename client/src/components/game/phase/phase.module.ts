import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamePhaseComponent } from './phase.component';

@NgModule({
  declarations: [
    GamePhaseComponent
  ],
  exports: [
    GamePhaseComponent
  ],
  imports: [
    CommonModule
  ],
})
export class GamePhaseModule { }
