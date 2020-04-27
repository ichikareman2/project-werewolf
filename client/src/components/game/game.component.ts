import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamePhase, RolesEnum, GamePhaseEnum, DayPhaseEnum, Player } from 'src/models';
import { PlayerService } from 'src/services/player.service';
import { GameService } from 'src/services/game.service';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  loadPage: boolean = false;
  players: Player[] = [
    {
      id: '1',
      aliasId: '1',
      name: 'Player 1',
      isHost: true,
      alive: true
    },
    {
      id: '2',
      aliasId: '2',
      name: 'Player 2',
      isHost: false,
      alive: true
    },
    {
      id: '3',
      aliasId: '3',
      name: 'Player 3',
      isHost: false,
      alive: true,
    },
    {
      id: '4',
      aliasId: '4',
      name: 'Player 4',
      isHost: false,
      alive: false,
      role: RolesEnum.SEER,
    },
    {
      id: '5',
      aliasId: '5',
      name: 'Player 5',
      isHost: false,
      alive: true,
    },
    {
      id: '6',
      aliasId: '6',
      name: 'Player 6',
      isHost: false,
      alive: false,
      role: RolesEnum.VILLAGER
    }
  ];
  gamePhase: GamePhase = {
    dayOrNight: GamePhaseEnum.NIGHT,
    roundPhase: DayPhaseEnum.VILLAGERSVOTE
  }
  role: RolesEnum = RolesEnum.VILLAGER;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private gameService: GameService
  ) {}

  async ngOnInit() {
    const player = await this.playerService.getPlayer();
    if( ! player ) {
      return this.router.navigate(['/']);
    }

    this.loadPage = true;
  }
}
