import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlphanumericValidatorDirective } from '../../directives/alphanumeric-validator.directive';
import { JoinGameComponent } from './join-game.component';

@NgModule({
  declarations: [
    AlphanumericValidatorDirective,
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
