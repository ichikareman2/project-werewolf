
export enum RolesEnum {
    VILLAGER = 'Villager',
    WEREWOLF = 'Werewolf',
    SEER = 'Seer'
}

export const NightPlayers = [
    RolesEnum.SEER,
    RolesEnum.WEREWOLF
];

export type Player = {
    id: string;
    aliasId: string;
    name: string;
    isHost: boolean;
    role?: RolesEnum;
    isAlive?: boolean;
    causeOfDeath: string;
};
