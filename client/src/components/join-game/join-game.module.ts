import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JoinGameComponent } from './join-game.component';

@NgModule({
  declarations: [
    JoinGameComponent
  ],
  exports: [
    JoinGameComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class JoinGameModule { }
