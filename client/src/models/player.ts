
export enum RolesEnum {
    VILLAGER = 'Villager',
    WEREWOLF = 'Werewolf',
    SEER = 'Seer'
}

export type Player = {
    id: string;
    aliasId: string;
    name: string;
    isHost: boolean;
    role?: RolesEnum;
    isAlive?: boolean;
    causeOfDeath: string;
};
