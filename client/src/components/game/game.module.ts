import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { GameInstructionModule } from './instructions/instruction.module';
import { GamePhaseModule } from './phase/phase.module';
import { GamePlayerModule } from './player/player.module';

@NgModule({
  declarations: [
    GameComponent
  ],
  exports: [
    GameComponent
  ],
  imports: [
    CommonModule,
    GameInstructionModule,
    GamePhaseModule,
    GamePlayerModule
  ],
})
export class GameModule { }
