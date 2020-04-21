import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from 'src/components/header/header.module';
import { JoinGameModule } from 'src/components/join-game/join-game.module';
import { GameModule } from 'src/components/game/game.module';
import { LobbyComponent } from 'src/components/lobby/lobby.component';
import { LobbyService } from 'src/services/lobby.service';
import { FormValidationService } from 'src/services/form-validation.service';
import { ApiService } from 'src/services/api.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PlayerService } from 'src/services/player.service';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderModule,
    JoinGameModule,
    GameModule
  ],
  providers: [
    FormValidationService,
    ApiService,
    LocalStorageService,
    PlayerService,
    LobbyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {}
}
