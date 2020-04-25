import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlayerService } from './player.service';

const SOCKET_EVENTS = {
    GAME_START: 'gameStart',
    GAME_PAUSE: 'gamePause',
    GAME_UPDATE: 'gameUpdate'
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

    private socket;

    constructor(
        private playerService: PlayerService,
        private router: Router
    ) {
        const playerId = this.playerService.getPlayerId();
        if( !playerId ) {
            this.router.navigate(['/']);
        }

        this.socket = io(`${environment.SERVER_ENDPOINT}/game`);
    }
}
