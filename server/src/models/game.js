//@ts-check
/** @typedef {import('./game-player').GamePlayer} GamePlayer */
/** @typedef {import('./game-phase').GamePhase} GamePhase */
/** @typedef {import('./player').Player} Player */
/** @typedef {import('./player').PublicPlayer} PublicPlayer */
/** @typedef {import('./lobby').PublicLobbyPlayer} PublicLobbyPlayer */
/** @typedef {import('./vote').Vote} Vote */

const { createNewGamePhase } = require('./game-phase')

/**
 * @typedef {Object} Game
 * @property {(GamePlayer)[]} players
 * @property {GamePhase} phase
 * @property {number} round
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
        round: 0,
        votes: []
    }
}
/** set game players
 * @param {GamePlayer[]} players 
 * @param {Game} game
 * @returns {Game}
 */
function setGamePlayers(players, game) {
    return {
        players: players,
        ...game
    }
}
/** update socketId of a player in game.
 * set to undefined on disconnect
 * @param {GamePlayer[]} gamePlayers
 * @param {Game} game
 * @returns {Game}
 */
function updateGamePlayers(gamePlayers, game) {
    return {
        players: gamePlayers,
        ...game
    };
}




module.exports = {
    createNewGame,
    setGamePlayers,
    updateGamePlayers
}