import { Player } from './player';

export interface Lobby {
    players: Player[];
    roomCode: string;
}
