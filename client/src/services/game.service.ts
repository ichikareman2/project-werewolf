import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlayerService } from './player.service';
import { Game } from 'src/models';

const SOCKET_EVENTS = {
    GAME_JOIN: 'joinGame',
    GAME_UPDATE: 'gameUpdated',
    GAME_VOTE: 'vote',
    GAME_LEAVE: 'leaveGame',
    GAME_RESTART: 'restartGame',
    GAME_RESTARTED: 'gameRestarted',
    GAME_CLOSE: 'closeGame',
    GAME_CLOSED: 'gameClosed',
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

    private socket;
    private game: Observable<Game>;
    private playerId: string;
    private isGameRestarted: Observable<boolean>;
    private isGameClosed: Observable<boolean>;

    constructor(
        private playerService: PlayerService,
        private router: Router
    ) {
        const playerId = this.playerService.getPlayerId();
        if ( !playerId ) {
            this.router.navigate(['/']);
        }

        this.playerId = playerId;
        this.socket = io(`${environment.SERVER_ENDPOINT}/game`);
        this.game = fromEvent(this.socket, SOCKET_EVENTS.GAME_UPDATE);
        this.isGameRestarted = fromEvent(this.socket, SOCKET_EVENTS.GAME_RESTARTED);
        this.isGameClosed = fromEvent(this.socket, SOCKET_EVENTS.GAME_CLOSED);
    }

    public joinGame() {
        this.socket.emit(SOCKET_EVENTS.GAME_JOIN, this.playerId, (data) => {
            if(data.error) {
                this.router.navigate(['/lobby']);
            }
        });
    }

    public getGame(): Observable<Game> {
        return this.game;
    }

    public sendVote(vote: string) {
        this.socket.emit(SOCKET_EVENTS.GAME_VOTE, vote, this.playerId);
    }

    public leaveGame() {
        this.socket.emit(SOCKET_EVENTS.GAME_LEAVE);
    }

    public restartGame() {
        this.socket.emit(SOCKET_EVENTS.GAME_RESTART, this.playerId);
    }

    public isGameRestart() {
        return this.isGameRestarted;
    }

    public closeGame() {
        this.socket.emit(SOCKET_EVENTS.GAME_CLOSE, this.playerId);
    }

    public isGameClose() {
        return this.isGameClosed;
    }
}
