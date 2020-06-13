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
    LOBBY_KICK_PLAYER: 'kickPlayer',
    LOBBY_KICKED_PLAYER: 'playerKicked',
};

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

    private socket;
    private lobbyPlayers: Observable<Player[]>;
    private isGameStart: Observable<boolean>;
    private isPlayerKick: Observable<boolean>;

    constructor(
        private playerService: PlayerService,
        private router: Router
    ) {
        this.socket = io(`${environment.SERVER_ENDPOINT}/lobby`);

        this.handleJoinLobby();

        this.lobbyPlayers = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_PLAYER_LIST);
        this.isGameStart = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_GAME_STARTED);
        this.isPlayerKick = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_KICKED_PLAYER);
    }

    public handleJoinLobby() {
        const playerId = this.playerService.getPlayerId();
        if ( !playerId ) {
            this.router.navigate(['/']);
        }

        this.socket.emit(SOCKET_EVENTS.LOBBY_JOIN, playerId);
    }

    public getLobbyPlayers(): Observable<Player[]> {
        return this.lobbyPlayers;
    }

    public isGameStarted(): Observable<boolean>{
        return this.isGameStart;
    }

    public isPlayerKicked(): Observable<boolean> {
        return this.isPlayerKick;
    }

    public handleStartGame() {
        this.socket.emit(SOCKET_EVENTS.LOBBY_GAME_START);
    }

    public handleLeaveLobby() {
        this.socket.emit(SOCKET_EVENTS.LOBBY_LEAVE);
    }

    public handleKickPlayer(playerAliasId: string) {
        const playerId = this.playerService.getPlayerId();
        this.socket.emit(SOCKET_EVENTS.LOBBY_KICK_PLAYER, playerId, playerAliasId);
    }
}
