import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'src/components/toast/toast.module';
import { LobbyComponent } from './lobby.component';

@NgModule({
  declarations: [
    LobbyComponent
  ],
  exports: [
    LobbyComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
  ],
})
export class LobbyModule { }
