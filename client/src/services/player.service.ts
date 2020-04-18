import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { Player } from '../models';
import { environment } from '../environments/environment';
import { ApiService } from './api.service';

const SOCKET_EVENTS = {};
const LOCAL_STORAGE_KEY = 'werewolf-player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    private socket;
    private player: Player;

    constructor(private apiService: ApiService, private router: Router) {
        this.socket = io(`${environment.SERVER_ENDPOINT}/player`);
    }

    registerPlayer(name: string) {
        this.apiService
            .post('/player', { name })
            .subscribe(response => {
                localStorage.setItem(LOCAL_STORAGE_KEY, response.id);
                this.player = response;
                this.router.navigate(['/lobby']);
            });
    }

    getPlayer() : Player | null {
        // TODO: if null, check local storage and query BE if ID exists
        return this.player;
    }
}
