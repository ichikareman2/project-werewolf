import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinGameComponent } from '../components/join-game/join-game.component';
import { LobbyComponent } from '../components/lobby/lobby.component';

const routes: Routes = [
  {
    path: 'lobby',
    component: LobbyComponent
  },
  {
    path: '',
    component: JoinGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
