import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastComponent } from 'src/components/toast/toast.component';
import { LobbyService } from 'src/services/lobby.service';
import { PlayerService } from 'src/services/player.service';
import { Player } from 'src/models';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  /** rxjs subscriptions (result of subscribe()) need to be disposed or they 
   * will never be destroyed. */
  _sub = new Subscription();
  get sub() { return this._sub; }
  set sub(subscription: Subscription) {
    this.sub.add(subscription);
  }

  playerList: Player[];
  roomCode = 'CODE';
  isHostPlayer = false;
  canStartGame = false;

  @ViewChild(ToastComponent) lobbyToast: ToastComponent;
  constructor(
    private lobbyService: LobbyService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async ngOnInit() {
    const player = await this.playerService.getPlayer();

    const lobbyObservable = this.lobbyService.getLobbyPlayers();
    this.sub = lobbyObservable.subscribe(response => {
      this.playerList = response;
      this.canStartGame = this.playerList.length >= 5;
      this.isHostPlayer = (response.filter(x => x.aliasId === player.aliasId))[0].isHost;
    });

    const gameStartObservable = this.lobbyService.isGameStarted();
    this.sub = gameStartObservable.subscribe(() => {
      this.lobbyService.handleLeaveLobby();
      this.router.navigate(['/game']);
    });

    const playerKickedObservable = this.lobbyService.isPlayerKicked();
    this.sub = playerKickedObservable.subscribe(() => {
      this.lobbyToast.show({
        title: 'Oops! Techinical difficulty.',
        message: 'Looks like the host kicked you out. You\'ll be redirected to the home page in a few seconds..',
      });
      setTimeout(() => {
        this.router.navigate(['/join']);
      }, 3000);
    });
  }

  async handleStartGame() {
    this.lobbyService.handleStartGame();
  }

  async handleLeaveLobby() {
    this.lobbyService.handleLeaveLobby();
    this.router.navigate(['/join']);
  }

  async handleKickPlayer(playerAliasId) {
    this.lobbyService.handleKickPlayer(playerAliasId);
  }
}
