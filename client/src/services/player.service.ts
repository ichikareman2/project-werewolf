import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../models';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';

const LOCAL_STORAGE_KEY = 'werewolf-player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {}

    async registerPlayer(name: string) {
        const response = await this.apiService.post('/player', { name }).toPromise();
        this.localStorageService.setItem(LOCAL_STORAGE_KEY, response.id);
        this.router.navigate(['/lobby']);
    }

    async getPlayer(): Promise<Player> | null {
        const playerId = this.getPlayerId();
        if ( ! playerId ) {
            return null;
        }
        const player = await this.apiService.get(`/player/${playerId}`, {}).toPromise();

        return Promise.resolve(player);
    }

    getPlayerId(): string | null {
        return this.localStorageService.getItem(LOCAL_STORAGE_KEY);
    }

    clearPlayer() {
        return this.localStorageService.removeItem(LOCAL_STORAGE_KEY);
    }
}
