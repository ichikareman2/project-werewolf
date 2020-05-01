import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamePhase, RolesEnum, GamePhaseEnum, DayPhaseEnum, Player, Game } from 'src/models';
import { PlayerService } from 'src/services/player.service';
import { GameService } from 'src/services/game.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  loadPage = false;
  players: Player[] = [];
  gamePhase: GamePhase = {
    dayOrNight: GamePhaseEnum.NIGHT,
    roundPhase: DayPhaseEnum.VILLAGERSVOTE
  };
  role: RolesEnum = RolesEnum.VILLAGER;
  currentPlayer: Player;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private gameService: GameService
  ) {}

  async ngOnInit() {
    const player = await this.playerService.getPlayer();
    if ( ! player ) {
      return this.router.navigate(['/']);
    }

    this.loadPage = true;

    const gameObservable = this.gameService.getGame();
    gameObservable.subscribe(response => {
      if( ! this.currentPlayer ) {
        this.getCurrentPlayer(player.aliasId, response.players);
        this.role = this.currentPlayer.role;
      }

      this.players = response.players;
      this.gamePhase = response.phase;
    });

    this.gameService.joinGame();
  }

  private getCurrentPlayer(playerAliasId: string, players: Player[]) {
    this.currentPlayer = players.filter(x => x.aliasId === playerAliasId)[0];
  }
}
