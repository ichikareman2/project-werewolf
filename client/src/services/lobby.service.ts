import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { Lobby } from '../models';
import { environment } from '../environments/environment';

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

    constructor() {
        this.socket = io(`${environment.SERVER_ENDPOINT}/lobby`);

        this.socket.emit( SOCKET_EVENTS.LOBBY_JOIN, 'player_id' )
        this.lobby = fromEvent(this.socket, SOCKET_EVENTS.LOBBY_PLAYER_LIST);
    }

    public getLobby() : Observable<Lobby> {
        return this.lobby;
    }
}
