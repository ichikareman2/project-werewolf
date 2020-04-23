import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamePlayerComponent } from './player.component';

@NgModule({
  declarations: [
    GamePlayerComponent
  ],
  exports: [
    GamePlayerComponent
  ],
  imports: [
    CommonModule,
  ],
})
export class GamePlayerModule { }
