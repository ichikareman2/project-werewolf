import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { Player } from 'src/models';
import { environment } from 'src/environments/environment';
import { PlayerService } from './player.service';
import { Router } from '@angular/router';

const SOCKET_EVENTS = {
    LOBBY_PLAYER_GET: 'getLobbyPlayers',
    LOBBY_PLAYER_LIST: 'playerList',
    LOBBY_JOIN: 'joinLobby',
    LOBBY_LEAVE: 'leaveLobby',
    LOBBY_GAME_START: 'gameStart',
    LOBBY_GAME_STARTED: 'gameStarted',
};

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

    private socket;
    private lobbyPlayers: Observable<Player[]>;
    private isGameStart: Observable<boolean>;

    constructor(
        private playerService: PlayerService,
        private router: Router
    ) {
        this.socket = io(`${environment.SERVER_ENDPOINT}/lobby`);

        const playerId = this.playerService.getPlayerId();
        if ( !playerId ) {
            this.router.navigate(['/']);
        }

        this.socket.emit( SOCKET_EVENTS.LOBBY_JOIN, playerId );
        this.lobbyPlayers = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_PLAYER_LIST);
        this.isGameStart = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_GAME_STARTED);
    }

    public getLobbyPlayers(): Observable<Player[]> {
        return this.lobbyPlayers;
    }

    public isGameStarted(): Observable<boolean>{
        return this.isGameStart;
    }

    public handleStartGame() {
        this.socket.emit(SOCKET_EVENTS.LOBBY_GAME_START);
    }

    public handleLeaveLobby() {
        this.socket.emit(SOCKET_EVENTS.LOBBY_LEAVE);
    }
}
