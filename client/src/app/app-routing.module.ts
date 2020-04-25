import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinGameComponent } from 'src/components/join-game/join-game.component';
import { LobbyComponent } from 'src/components/lobby/lobby.component';
import { GameComponent } from 'src/components/game/game.component';
import { RolesComponent } from 'src/components/roles/roles.component';

const routes: Routes = [
  {
    path: 'lobby',
    component: LobbyComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: 'roles',
    component: RolesComponent
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
