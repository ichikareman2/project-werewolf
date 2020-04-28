
export enum RolesEnum {
    VILLAGER = 'villager',
    WEREWOLF = 'werewolf',
    SEER = 'seer'
}

export type Player = {
    id: string;
    aliasId: string;
    name: string;
    isHost: boolean;
    role?: RolesEnum;
    alive?: boolean;
};
