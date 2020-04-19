import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidateFormsModule } from '../../modules/validate-forms.module';
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
    FormsModule,
    ValidateFormsModule
  ],
})
export class JoinGameModule { }
