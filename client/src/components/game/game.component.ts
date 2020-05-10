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
  getGameOverMessage,
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
  modalPrimaryButton = 'Confirm';
  modalSecondaryButton = 'Cancel';
  modalMessage = '';

  notifications = [];
  hasGameRestarted = false;
  hasWinner = false;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private gameService: GameService
  ) {
    $('.toast').toast({
      animation: true,
      autohide: true,
      delay: 2000,
    });
  }

  async ngOnInit() {
    const player = await this.playerService.getPlayer();
    if ( ! player ) {
      return this.router.navigate(['/']);
    }

    const restartGameObservable = this.gameService.isGameRestart();
    restartGameObservable.subscribe(() => {
      this.hasGameRestarted = true;
      this.currentPlayer = null;
      this.showGameRestartedModal();
    });

    const gameObservable = this.gameService.getGame();
    gameObservable.subscribe(response => {
      console.log(response);
      const { players, alphaWolf, winner, seerPeekedAliasIds } = response;

      if (winner) {
        this.hasWinner = true;
        return this.showWinner(winner);
      }

      this.getCurrentPlayer(player.aliasId, players, alphaWolf);
      this.getUpdates(response);

      this.game = response;
      this.showVote = this.canVote();
      this.players = this.assignPlayerVote(this.reorderPlayers(players));

      if(this.role === RolesEnum.SEER) {
        this.markPeekedPlayers(seerPeekedAliasIds);
      }

      $('.toast').toast('show');
    });

    this.gameService.joinGame();

    this.loadPage = true;
  }

  public showGameRestartedModal() {
    this.modalHeader = 'Attention';
    this.modalMessage = 'The host restarted the game.';
    this.modalPrimaryButton = 'Got it';
    this.modalSecondaryButton = 'Close';

    $(`#${this.modalId}`).on('hidden.bs.modal', () => {
      this.hasGameRestarted = false;
    });
    $(`#${this.modalId}`).modal('show');
  }

  public showWinner(winner) {
    console.log('game oveeeeer!');
    this.modalHeader = 'Game Over';
    this.modalMessage = getGameOverMessage(winner);
    this.modalPrimaryButton = 'New Game';
    this.modalSecondaryButton = 'Leave Game';

    $(`#${this.modalId}`).modal('show');
  }

  public handlePlayerClick(data) {
    if ( !!this.votedPlayer || ! this.canVote() || ! this.canBeVoted(data) ) {
      return;
    }

    this.votedPlayer = data;
    this.modalHeader = 'Confirm Vote';
    this.modalPrimaryButton = 'Confirm';
    this.modalSecondaryButton = 'Cancel';
    this.modalMessage = getConfirmationMessage(this.role, this.votedPlayer.name);
    $(`#${this.modalId}`).modal('show');
  }

  public handleRestartGame() {
    if ( ! this.currentPlayer.isHost ) {
      return;
    }

    this.gameService.restartGame();
  }

  public reset() {
    this.votedPlayer = null;
    this.hasGameRestarted = false;

    if (this.hasWinner) {
      this.hasWinner = false;
      this.playerService.clearPlayer();
      this.gameService.leaveGame();
      return this.router.navigate(['/']);
    }
  }

  public submit() {
    $(`#${this.modalId}`).modal('hide');

    if (this.hasWinner) {
      this.hasWinner = false;
      return this.router.navigate(['/lobby']);
    }

    if (this.hasGameRestarted) {
      this.hasGameRestarted = false;
      return;
    }

    if (this.votedPlayer) {
      setTimeout(() => this.gameService.sendVote(this.votedPlayer.aliasId), 500);
    }
  }

  // checks if voting is enabled depending on phase and role
  private canVote() {
    if ( ! this.currentPlayer.isAlive || this.game.winner ) {
      return false;
    }

    if ( this.game.phase.dayOrNight === GamePhaseEnum.DAY
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
  private getCurrentPlayer(playerAliasId: string, players: Player[], alphaWolf: string) {
    this.currentPlayer = players.filter(x => x.aliasId === playerAliasId)[0];
    this.role = this.currentPlayer.role;
    this.isAlphaWolf = this.currentPlayer.role === RolesEnum.WEREWOLF && alphaWolf === this.currentPlayer.aliasId;
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
      const vote = this.getVote(p.aliasId);

      if (p.aliasId === this.currentPlayer.aliasId) {
        this.votedPlayer = vote;
      }

      return {
        ...p,
        vote,
        voteCount: this.getVoteCount(p.aliasId),
      };
    });
  }

  private getVote(playerAliasId: string): Player|null {
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

  private getVoteCount(playerAliasId: string): number {
    const { votes } = this.game;
    const playerVotes = votes.filter(x => x.votedAliasId === playerAliasId);

    return playerVotes.length;
  }

  private getKilledPlayer(newGameState: Game): Player|null {
    const prevEliminatedPlayers = this.game.players.filter(x => !x.isAlive);
      const newEliminatedPlayers = newGameState.players.filter(x => !x.isAlive);

      return newEliminatedPlayers.filter(x =>
        prevEliminatedPlayers.findIndex(y => y.id === x.id) === -1
      )[0];
  }

  private getUpdates(response: Game) {
    this.notifications = [];

    if( ! this.game || this.game.phase.dayOrNight === response.phase.dayOrNight ) {
      return;
    }

    const killedPlayer = this.getKilledPlayer(response);
    if(killedPlayer) {
      this.notifications.unshift({
        header: 'Someone\'s been killed!',
        message: `(gasp) ${killedPlayer.name} has been ${killedPlayer.causeOfDeath.toLowerCase()}`
      });
    }

    if(this.isAlphaWolf && response.phase.dayOrNight === GamePhaseEnum.NIGHT) {
      this.notifications.unshift({
        header: 'Hunting time!',
        message: 'You\'re the alpha wolf tonight.'
      });
    }

    console.log(this.notifications);
  }

  private markPeekedPlayers(seerPeekedAliasIds: string[]) {
    this.players.forEach(p => {
      p.peeked = seerPeekedAliasIds.includes(p.aliasId);
    });
  }
}
