import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinGameComponent } from 'src/components/join-game/join-game.component';
import { LobbyComponent } from 'src/components/lobby/lobby.component';
import { GameComponent } from 'src/components/game/game.component';
import { RolesComponent } from 'src/components/roles/roles.component';
import { GameRulesComponent } from 'src/components/game-rules/game-rules.component';
import { Page404Component } from 'src/components/page404/page404.component';
import { CreateRoomComponent } from '../components/create-room/create-room.component';

const routes: Routes = [
  {
    path: 'lobby',
    component: LobbyComponent
  },
  {
    path: 'join',
    component: JoinGameComponent
  },
  {
    path: 'create',
    component: CreateRoomComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'game-rules',
    component: GameRulesComponent,
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: '',
    component: GameComponent
  },
  {
    path: '**',
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
