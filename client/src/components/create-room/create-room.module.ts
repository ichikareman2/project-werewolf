import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidateFormsModule } from '../../modules/validate-forms.module';
import { CreateRoomComponent } from './create-room.component';

@NgModule({
  declarations: [
    CreateRoomComponent
  ],
  exports: [
    CreateRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ValidateFormsModule
  ]
})
export class CreateRoomModule { }
