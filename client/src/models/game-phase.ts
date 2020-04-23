
enum dayOrNightEnum {
    DAY = "Day",
    NGIHT = "Night"
};

enum DayPhaseEnum {
    VILLAGERSVOTE = "Villagers Vote",
};

enum NightPhaseEnum {
    WEREWOLVESHUNT = "Werewolves Hunt",
    SEERPREEK = "Seer Peek"
};

export type GamePhase = {
    dayOrNight: dayOrNightEnum;
    roundPhase: DayPhaseEnum | NightPhaseEnum;
}
