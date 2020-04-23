import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { GameInstructionModule } from './instructions/instruction.module';

@NgModule({
  declarations: [
    GameComponent
  ],
  exports: [
    GameComponent
  ],
  imports: [
    CommonModule,
    GameInstructionModule
  ],
})
export class GameModule { }
