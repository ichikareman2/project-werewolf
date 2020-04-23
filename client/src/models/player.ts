
export enum RolesEnum {
    VILLAGER = 'villager',
    WEREWOLF = 'werewolf',
    SEER = 'seer'
}

export type Player = {
    id: string;
    name: string;
    isHost: boolean;
}
