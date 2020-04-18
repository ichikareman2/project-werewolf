import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { Lobby, GamePhase } from '../models';
import { environment } from '../environments/environment';

const SOCKET_EVENTS = {
    LOBBY: 'lobby',
    GAME_PHASE: 'game-phase'
};

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {

    private socket;
    private lobby: Observable<Lobby>;
    private gamePhase: Observable<GamePhase[]>;

    constructor() {
        this.socket = io(environment.SOCKET_ENDPOINT);

        this.lobby = fromEvent(this.socket, SOCKET_EVENTS.LOBBY);
        this.gamePhase = fromEvent(this.socket, SOCKET_EVENTS.GAME_PHASE);
    }

    public getLobby() : Observable<Lobby> {
        return this.lobby;
    }

    public getGamePhase() : Observable<GamePhase[]> {
        return this.gamePhase;
    }
}
