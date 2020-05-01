import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from 'src/services/lobby.service';
import { PlayerService } from 'src/services/player.service';
import { Player } from 'src/models';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  playerList: Player[];
  roomCode = 'CODE';
  isHostPlayer = false;
  canStartGame = false;

  constructor(
    private lobbyService: LobbyService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  async ngOnInit() {
    const player = await this.playerService.getPlayer();

    const lobbyObservable = this.lobbyService.getLobbyPlayers();
    lobbyObservable.subscribe(response => {
      this.playerList = response;
      this.canStartGame = this.playerList.length >= 5;
      this.isHostPlayer = (response.filter(x => x.aliasId === player.aliasId))[0].isHost;
    });

    const gameStartObservable = this.lobbyService.isGameStarted();
    gameStartObservable.subscribe(() => {
      this.router.navigate(['/game']);
    });
  }

  async handleStartGame() {
    this.lobbyService.handleStartGame();
  }
}
