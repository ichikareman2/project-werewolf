import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameInstructionComponent } from './instruction.component';

@NgModule({
  declarations: [
    GameInstructionComponent
  ],
  exports: [
    GameInstructionComponent
  ],
  imports: [
    CommonModule,
  ],
})
export class GameInstructionModule { }
