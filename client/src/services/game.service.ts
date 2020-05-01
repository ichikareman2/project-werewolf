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
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

    private socket;
    private game: Observable<Game>;
    private playerId: string;

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
    }

    public joinGame() {
        this.socket.emit(SOCKET_EVENTS.GAME_JOIN, this.playerId);
    }

    public getGame(): Observable<Game> {
        return this.game;
    }

    public sendVote(vote: string) {
        this.socket.emit(SOCKET_EVENTS.GAME_VOTE, vote, this.playerId);
    }
}
