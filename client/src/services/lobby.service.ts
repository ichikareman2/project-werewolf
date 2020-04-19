import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { Lobby } from 'src/models';
import { environment } from 'src/environments/environment';
import { PlayerService } from './player.service';
import { Router } from '@angular/router';

const SOCKET_EVENTS = {
    LOBBY_PLAYER_GET: 'getLobbyPlayers',
    LOBBY_PLAYER_LIST: 'playerList',
    LOBBY_JOIN: 'joinLobby',
    LOBBY_LEAVE: 'leaveLobby',
};

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

    private socket;
    private lobby: Observable<Lobby>;

    constructor(
        private playerService: PlayerService,
        private router: Router
    ) {
        this.socket = io(`${environment.SERVER_ENDPOINT}/lobby`);

        const playerId = this.playerService.getPlayerId();
        if( !playerId ) {
            this.router.navigate(['/']);
        }

        this.socket.emit( SOCKET_EVENTS.LOBBY_JOIN, playerId );
        this.lobby = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_PLAYER_LIST);
    }

    public getLobby() : Observable<Lobby> {
        return this.lobby;
    }
}
