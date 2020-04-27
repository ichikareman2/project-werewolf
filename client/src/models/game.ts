
export enum GamePhaseEnum {
    DAY = "Day",
    NIGHT = "Night"
};

export enum DayPhaseEnum {
    VILLAGERSVOTE = "Villagers Vote",
    VILLAGEDISCUSSION = "Village Discussion"
};

export enum NightPhaseEnum {
    WEREWOLVESHUNT = "Werewolves Hunt",
    SEERPREEK = "Seer Peek"
};

export type GamePhase = {
    dayOrNight: GamePhaseEnum;
    roundPhase: DayPhaseEnum | NightPhaseEnum;
}

export type Game = {
    phase: GamePhase;
    round: number;
}
