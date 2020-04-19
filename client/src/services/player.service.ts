import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { Player } from '../models';
import { environment } from '../environments/environment';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';

const SOCKET_EVENTS = {};
const LOCAL_STORAGE_KEY = 'werewolf-player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    private socket;
    private player: Player;

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {
        this.socket = io(`${environment.SERVER_ENDPOINT}/player`);
    }

    registerPlayer(name: string) {
        this.apiService
            .post('/player', { name })
            .subscribe(response => {
                this.localStorageService.setItem(LOCAL_STORAGE_KEY, response.id);
                this.player = response;
                this.router.navigate(['/lobby']);
            });
    }

    async getPlayer() : Promise<Player> | null {
        if( ! this.player ) {
            const playerId = this.localStorageService.getItem(LOCAL_STORAGE_KEY);
            if( ! playerId ) {
                return null;
            }
            return this.apiService.get(`/player/${playerId}`, {}).toPromise();
        }

        return Promise.resolve(this.player);
    }
}
