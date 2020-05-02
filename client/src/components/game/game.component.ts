import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  RolesEnum,
  GamePhaseEnum,
  DayPhaseEnum,
  Player,
  Vote,
  NightPlayers,
  getConfirmationMessage,
  Game
} from 'src/models';
import { PlayerService } from 'src/services/player.service';
import { GameService } from 'src/services/game.service';

declare var $: any;

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  loadPage = false;
  game: Game;
  players: Player[] = [];
  role: RolesEnum = RolesEnum.VILLAGER;
  currentPlayer: Player;
  votedPlayer: Player;
  showVote: boolean;
  isAlphaWolf = false;

  modalId = 'modal-vote-confirm';
  modalHeader = 'Confirm Vote';
  modalMessage: string = '';

  alertMessage = '';
  showAlert = false;

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

    const gameObservable = this.gameService.getGame();
    gameObservable.subscribe(response => {
      console.log(response);
      this.game = response;

      if ( ! this.currentPlayer ) {
        this.getCurrentPlayer(player.aliasId, response.players);
        this.role = this.currentPlayer.role;
      }

      this.showVote = this.canVote();
      this.isAlphaWolf = this.role === RolesEnum.WEREWOLF && response.alphaWolf === this.currentPlayer.aliasId;
      this.players = this.assignPlayerVote(this.reorderPlayers(response.players));
    });

    this.gameService.joinGame();

    this.loadPage = true;
  }

  public handlePlayerClick(data) {
    if ( this.votedPlayer || ! this.canVote() || ! this.canBeVoted(data) ) {
      return;
    }

    this.votedPlayer = data;
    this.modalMessage = getConfirmationMessage(this.role, this.votedPlayer.name);
    $(`#${this.modalId}`).modal('show');
  }

  public resetVote() {
    this.votedPlayer = null;
  }

  public submitVote() {
    this.gameService.sendVote(this.votedPlayer.aliasId);
    $(`#${this.modalId}`).modal('hide');
  }

  // checks if voting is enabled depending on phase and role
  private canVote() {
    if ( ! this.currentPlayer.isAlive ) {
      return false;
    }

    if ( this.game.phase.dayOrNight === GamePhaseEnum.DAY
      && this.game.phase.roundPhase === DayPhaseEnum.VILLAGERSVOTE
    ) {
      return true;
    }

    if ( this.game.phase.dayOrNight === GamePhaseEnum.NIGHT
      && NightPlayers.includes( this.role )
    ) {
      return this.role === RolesEnum.WEREWOLF
        ? this.isAlphaWolf
        : true;
    }

    return false;
  }

  // checks if clicked player can be selected
  private canBeVoted(data) {
    return data.aliasId !== this.currentPlayer.aliasId && data.isAlive;
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

  // set player's vote
  private assignPlayerVote(players: Player[]) {
    return players.map((p) => {
      return {
        ...p,
        vote: this.getVote(p.aliasId),
        voteCount: this.getVoteCount(p.aliasId),
      };
    });
  }

  private getVote(playerAliasId: string) : Player|null {
    const { players, votes, werewolfVote } = this.game;

    if ( votes.length === 0 ) {
      return null;
    }

    if ( werewolfVote ) {
      return players.filter(x => x.aliasId === werewolfVote)[0];
    }

    const vote = votes.filter(x => x.voterAliasId === playerAliasId)[0];
    if ( vote ) {
      return players.filter(x => x.aliasId === vote.votedAliasId)[0];
    }

    return null;
  }

  private getVoteCount(playerAliasId: string) : number {
    const { votes } = this.game;
    const playerVotes = votes.filter(x => x.votedAliasId === playerAliasId);

    return playerVotes.length;
  }
}
