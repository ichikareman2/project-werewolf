//@ts-check
/** @typedef {import('./game-player').GamePlayer} GamePlayer */
/** @typedef {import('./game-player').PublicGamePlayer} PublicGamePlayer */
/** @typedef {import('./game-phase').GamePhase} GamePhase */
/** @typedef {import('./player').Player} Player */
/** @typedef {import('./player').PublicPlayer} PublicPlayer */
/** @typedef {import('./lobby').PublicLobbyPlayer} PublicLobbyPlayer */
/** @typedef {import('./vote').Vote} Vote */

const { createNewGamePhase } = require('./game-phase')

/** Game Model
 * @typedef {Object} Game
 * @property {(GamePlayer)[]} players - players
 * @property {GamePhase} phase - current phase of game
 * @property {number} round - round number
 * @property {Vote[]} votes - current votes for the phase
 * @property {string[]} seerPeekedAliasIds - alias ids that the seer has peeked on
 */
/** Incomplete Game model with sensitive properties removed.
 *  @typedef {Omit<(Game), 'seerPeekedAliasIds' | 'players'>} GameWithOmission */
/** Incomplete Game model same as `gameWithOmissions` but for seer
 * @typedef {Omit<(Game), 'players'>} SeerGameWithOmission */

 /** Game model's player property but as public game player
 * @typedef {{players: PublicGamePlayer[]}} WithPublicPlayer */

/** public game model
 * @typedef {GameWithOmission & WithPublicPlayer} PublicGame */
/** public game model but for seer
 * @typedef {SeerGameWithOmission & WithPublicPlayer} SeerPublicGame */


/**
 * Create a new game state
 * @returns {Game}
 */
function createNewGame() {
    return {
        players: [],
        phase: createNewGamePhase(),
        round: 0,
        votes: [],
        seerPeekedAliasIds: []
    }
}
/** set game players
 * @param {GamePlayer[]} players 
 * @param {Game} game
 * @returns {Game}
 */
function setGamePlayers(players, game) {
    return {
        ...game,
        players: players
    }
}
/** get desensitized game state
 * @param {PublicGamePlayer[]} publicGamePlayers
 * @param {Game} game 
 * @returns {PublicGame}
 * */
function getPublicGame(publicGamePlayers, game) {
    const {seerPeekedAliasIds, players, ...safeGame} = game;
    return {...safeGame, players: publicGamePlayers};
}
/** get desensitized game state for seer
 * @param {PublicGamePlayer[]} publicGamePlayers
 * @param {Game} game 
 * @returns {SeerPublicGame}
 * */
function getSeerPublicGame(publicGamePlayers, game) {
    const {players, ...safeGame} = game;
    return {...safeGame, players: publicGamePlayers};
}


module.exports = {
    createNewGame,
    setGamePlayers,
    getPublicGame,
    getSeerPublicGame
}