// @ts-check
/**
 * phases of the day
 * @constant
 * @readonly
 */
const DayPhaseEnum = {
    VILLAGERSVOTE: "Villagers Vote",
}
/**
 * phases of the night
 * @constant
 * @readonly
 */
const NightPhaseEnum = {
    WEREWOLVESHUNT: "Werewolves Hunt",
    SEERPEEK: "Seer Peek"
}
/**
 * enum for day or night of game phase
 * @readonly
 */
const dayOrNightEnum = {
    DAY: "Day",
    NIGHT: "Night"
}

/**
 * @typedef {Object} GamePhase
 * @property {string} dayOrNight
 * @property {string} [roundPhase]
 */

/**
 * @type {GamePhase[]}
 * @readonly
 */
const gamePhases = [
    {
        dayOrNight: dayOrNightEnum.DAY
    },
    {
        dayOrNight: dayOrNightEnum.NIGHT
    }
    // {
    //     dayOrNight: dayOrNightEnum.DAY,
    //     roundPhase: DayPhaseEnum.VILLAGERSVOTE
    // },
    // {
    //     dayOrNight: dayOrNightEnum.NIGHT,
    //     roundPhase: NightPhaseEnum.WEREWOLVESHUNT
    // },
    // {
    //     dayOrNight: dayOrNightEnum.NIGHT,
    //     roundPhase: NightPhaseEnum.SEERPEEK
    // },
]
/**
 * create a game phase for new game
 * returns {GamePhase}
 */
function createNewGamePhase() {
    return gamePhases[0]
}

/** Gets a new game phase next to `currentGamePhase`
 * @param {GamePhase} currentGamePhase
 * @returns {GamePhase}
 */
function getNextGamePhase(currentGamePhase) {
    const newPhaseIndex = (gamePhases.indexOf(currentGamePhase) + 1) % gamePhases.length;
    return gamePhases[newPhaseIndex];
}
module.exports = {
    DayPhaseEnum,
    NightPhaseEnum,
    dayOrNightEnum,
    gamePhases,
    createNewGamePhase,
    getNextGamePhase
}
