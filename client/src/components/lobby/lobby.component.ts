import { Component, OnInit } from '@angular/core';
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
  roomCode: string = 'CODE';
  isHostPlayer: boolean = false;

  constructor(
    private lobbyService: LobbyService,
    private playerService: PlayerService
  ) {}

  async ngOnInit() {
    const player = await this.playerService.getPlayer();

    const lobbyObservable = this.lobbyService.getLobbyPlayers();
    lobbyObservable.subscribe(response => {
      this.playerList = response;
      this.isHostPlayer = (response.filter(x => x.aliasId === player.aliasId))[0].isHost;
    });

    const gameStartObservable = this.lobbyService.isGameStarted();
    gameStartObservable.subscribe(response => {
      console.log(response);
    });
  }
}
