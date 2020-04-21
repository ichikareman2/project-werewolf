import { Component, OnInit } from '@angular/core';
import { LobbyService } from 'src/services/lobby.service';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  playerList;
  roomCode: string = 'CODE';

  constructor(private lobbyService: LobbyService) {}

  ngOnInit(): void {
    const lobbyObservable = this.lobbyService.getLobby();
    lobbyObservable.subscribe(response => {
      this.playerList = response;
    });
  }
}
