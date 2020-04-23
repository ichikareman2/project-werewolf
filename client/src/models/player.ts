
export enum RolesEnum {
    VILLAGER = 'villager',
    WEREWOLF = 'werewolf',
    SEER = 'seer'
}

export interface Player {
    id: string;
    name: string;
    isHost: boolean;
}
