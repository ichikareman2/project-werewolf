//@ts-check
/** @typedef {import('./game-phase').GamePhase} GamePhase */
/** @typedef {import('./player').Player} Player */
/** @typedef {import('./vote').Vote} Vote */

const { createNewGamePhase } = require('./game-phase')

/**
 * @typedef {Object} Game
 * @property {Player[]} players
 * @property {GamePhase} phase
 * @property {Vote[]} votes
 */

/**
 * Create a new game state
 * @returns {Game}
 */
function createNewGame() {
    return {
        players: [],
        phase: createNewGamePhase(),
        votes: []
    }
}

module.exports = {
    createNewGame
}