import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  RolesEnum,
  GamePhaseEnum,
  Player,
  NightPlayers,
  getDefaultConfirmationMessage,
  getConfirmationMessage,
  getGameOverMessage,
  Game,
} from 'src/models';
import { PlayerService } from 'src/services/player.service';
import { GameService } from 'src/services/game.service';
import { ToastComponent } from '../toast/toast.component';
import { pairwise, filter, map, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  /** rxjs subscriptions (result of subscribe()) need to be disposed or they 
   * will never be destroyed. */
  _sub = new Subscription();
  get sub() { return this._sub; }
  set sub(subscription: Subscription) {
    this.sub.add(subscription);
  }
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

  /** binded to toast component */
  @ViewChild(ToastComponent) toast: ToastComponent;
  @ViewChildren('gamePlayer', {read: ElementRef}) playerBoxes: QueryList<ElementRef<HTMLDivElement>>;
  constructor(
    private router: Router,
    private playerService: PlayerService,
    private gameService: GameService
  ) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async ngOnInit() {
    const player = await this.playerService.getPlayer();
    if ( ! player ) {
      return this.router.navigate(['/join']);
    }

    const restartGameObservable = this.gameService.isGameRestart();
    this.sub = restartGameObservable.subscribe(() => {
      this.hasGameRestarted = true;
      this.currentPlayer = null;
      this.showGameRestartedModal();
    });

    const gameObservable = this.gameService.getGame();
    this.sub = gameObservable.subscribe(response => this.animatePlayers(() => {
      const { players, alphaWolf, winner, seerPeekedAliasIds } = response;

      if (winner) {
        this.hasWinner = true;
        return this.showWinner(winner);
      }

      this.getCurrentPlayer(player.aliasId, players, alphaWolf);

      this.game = response;
      this.showVote = this.canVote();
      this.players = this.assignPlayerVote(this.reorderPlayers(players));

      if(this.role === RolesEnum.SEER) {
        this.markPeekedPlayers(seerPeekedAliasIds);
      }
    }));

    this.gameService.joinGame();

    this.loadPage = true;

    /** subscription to show toast for killed player */
    this.sub = gameObservable.pipe(
      distinctUntilChanged((prev, curr) => !!curr.winner),
      map(game => game.players.filter(x => !x.isAlive)),
      pairwise(),
      map(([prev, curr]) => curr.find(c => prev.findIndex(p => p.aliasId === c.aliasId) === -1)),
      filter(x => x !== undefined),
      map(player => ({
        title: `Someone's been killed!`,
        message: `*gasp*! <b>${player.name}</b> has been <b>${player.causeOfDeath.toLowerCase()}</b>`
      }))
    ).subscribe(this.toast.show.bind(this.toast));

    /** subscription to show toast alpha wolf. */
    this.sub = gameObservable.pipe(
      distinctUntilChanged((prev, curr) => !!curr.winner || (prev.alphaWolf === curr.alphaWolf && prev.phase.dayOrNight === curr.phase.dayOrNight)),
      filter(game => game.alphaWolf === this.currentPlayer.aliasId &&
        game.phase.dayOrNight === GamePhaseEnum.NIGHT
      ),
      map(game => ({
        title: 'Hunting time!',
        message: 'You\'re the alpha wolf tonight.'
      }))
    ).subscribe(this.toast.show.bind(this.toast))
  };

  /** track by function for player list. */
  playersTrackByFn(_: number, player: Player) {
    return player.aliasId
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
    this.modalMessage = this.game.phase.dayOrNight === GamePhaseEnum.DAY
      ? getDefaultConfirmationMessage(this.votedPlayer.name)
      : getConfirmationMessage(this.role, this.votedPlayer.name);

    $(`#${this.modalId}`).on('hidden.bs.modal', () => {
      this.votedPlayer = null;
    });
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
      this.gameService.leaveGame();
      this.playerService.clearPlayer();

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 300);
    }
  }

  public submit() {
    const voteAliasId = (this.votedPlayer || {}).aliasId;

    $(`#${this.modalId}`).modal('hide');

    if (this.hasWinner) {
      this.hasWinner = false;
      return this.router.navigate(['/lobby']);
    }

    if (this.hasGameRestarted) {
      this.hasGameRestarted = false;
      return;
    }

    if (voteAliasId) {
      setTimeout(() => this.gameService.sendVote(voteAliasId), 500);
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

  private markPeekedPlayers(seerPeekedAliasIds: string[]) {
    this.players.forEach(p => {
      p.peeked = seerPeekedAliasIds.includes(p.aliasId);
    });
  }

  animatePlayers(fn) {
    const elements = this.playerBoxes.toArray().map(x => x.nativeElement.firstElementChild);
    const firstItemPositions = elements.map(x => x.getBoundingClientRect());
    
    fn();
    setTimeout(() => {
      elements.forEach((el, i) => {
        const first = firstItemPositions[i];
        const last = el.getBoundingClientRect();
        const x = first.left - last.left;
        const y = first.top - last.top;
        if(y !== 0) {
          el.animate(
            [
              {
                transformOrigin: "top left",
                transform: `translate(${x}px, ${y}px)`
              },
              {
                transformOrigin: "top left",
                transform: "none"
              }
            ],
            {
              duration: 350,
              easing: "ease-in-out",
              fill: "both"
            }
          );
        }
      });
    }, 0);
    
  }
}
