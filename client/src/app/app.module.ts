import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LobbyModule } from '../modules/lobby/lobby.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LobbyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
