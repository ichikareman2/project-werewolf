import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamePhase, RolesEnum, GamePhaseEnum, DayPhaseEnum, Player } from 'src/models';
import { PlayerService } from 'src/services/player.service';
import { GameService } from 'src/services/game.service';

declare var $: any;

const MODAL_MESSAGE = 'Are you sure you want to vote this player out?';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  loadPage = false;
  players: Player[] = [];
  gamePhase: GamePhase = {
    dayOrNight: GamePhaseEnum.DAY,
    roundPhase: DayPhaseEnum.VILLAGERSVOTE
  };
  role: RolesEnum = RolesEnum.VILLAGER;
  currentPlayer: Player;
  votedPlayer: Player;

  modalId: string = 'modal-vote-confirm';
  modalHeader: string = 'Confirm Vote';
  modalMessage: string = MODAL_MESSAGE;

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

      this.players = this.reorderPlayers(response.players);
      this.gamePhase = response.phase;
    });

    this.gameService.joinGame();
  }

  public handlePlayerClick(data) {
    if( data.aliasId === this.currentPlayer.aliasId || ! data.isAlive ) {
      return;
    }

    this.votedPlayer = data;
    this.modalMessage = MODAL_MESSAGE.replace('this player', this.votedPlayer.name);
    $(`#${this.modalId}`).modal('show');
  }

  public submitVote() {
    this.gameService.sendVote(this.votedPlayer.aliasId);
  }

  // get data specific to the current player
  private getCurrentPlayer(playerAliasId: string, players: Player[]) {
    this.currentPlayer = players.filter(x => x.aliasId === playerAliasId)[0];
  }

  // rearrange player list
  // [ current player, alive players, eliminated players ]
  private reorderPlayers(players: Player[]) {
    const eliminatedPlayers = players.filter(x => !x.isAlive && x.aliasId !== this.currentPlayer.aliasId);
    const alivePlayers = players.filter(x => x.isAlive && x.aliasId !== this.currentPlayer.aliasId);

    return [
      this.currentPlayer,
      ...alivePlayers,
      ...eliminatedPlayers
    ];
  }
}
