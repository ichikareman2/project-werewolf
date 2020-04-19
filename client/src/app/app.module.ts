import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JoinGameModule } from '../components/join-game/join-game.module';
import { CreateRoomModule } from '../components/create-room/create-room.module';
import { LobbyComponent } from '../components/lobby/lobby.component';
import { LobbySocketService } from '../services/lobby.service';
import { FormValidationService } from '../services/form-validation.service';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    JoinGameModule,
    CreateRoomModule
  ],
  providers: [
    FormValidationService,
    LobbySocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {}
}
