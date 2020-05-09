import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'src/components/modal/modal.module';
import { GamePhaseComponent } from './phase.component';

@NgModule({
  declarations: [
    GamePhaseComponent
  ],
  exports: [
    GamePhaseComponent
  ],
  imports: [
    CommonModule,
    ModalModule
  ],
})
export class GamePhaseModule { }
