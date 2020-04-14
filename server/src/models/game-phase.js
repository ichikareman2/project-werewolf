/**
 * phases of the day
 * @readonly
 * @enum {string}
 */
const DayPhaseEnum = {
    VILLAGERSVOTE: "Villagers Vote",
}
/**
 * phases of the night
 * @readonly
 * @enum {string}
 */
const NightPhaseEnum = {
    WEREWOLVESHUNT: "Werewolves Hunt",
    SEERPREEK: "Seer Peek"
}
/**
 * enum for day or night of game phase
 * @enum {string}
 * @readonly
 */
const dayOrNightEnum = {
    DAY: "Day",
    NGIHT: "Night"
}

/**
 * @typedef {Object} GamePhase
 * @property {dayOrNightEnum} dayOrNight
 * @property {DayPhaseEnum | NightPhaseEnum} roundPhase
 */

/**
 * @type {GamePhase[]}
 * @readonly
 */
const gamePhases = [
    {
        dayOrNight: dayOrNightEnum.DAY,
        roundPhase: DayPhaseEnum.VILLAGERSVOTE
    },
    {
        dayOrNight: dayOrNightEnum.NIGHT,
        roundPhase: NightPhaseEnum.WEREWOLVESHUNT
    },
    {
        dayOrNight: dayOrNightEnum.NIGHT,
        roundPhase: NightPhaseEnum.SEERPREEK
    },
]
/**
 * create a game phase for new game
 * returns {GamePhase}
 */
function createNewGamePhase() {
    return gamePhases[0]
}

/**
 * Gets a new game phase next to `currentGamePhase`
 * returns {GamePhase}
 */
function getNextGamePhase(currentGamePhase) {
    return (gamePhases.indexOf(currentGamePhase) + 1) % gamePhases.length
}
module.exports = {
    gamePhases,
    createNewGamePhase,
    getNextGamePhase
}
