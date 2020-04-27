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
 * @property {string} werewolfVote - alias id of player that werewolf hunted
 * @property {string} seerVote - alias id of player that the seer peeked on
 */
/** Incomplete Game model with sensitive properties removed.
 *  @typedef {Pick<(Game), 'phase' | 'round' | 'votes'>} GameWithOmission */
/** Incomplete Game model same as `gameWithOmissions` but for werewolf
 * @typedef {Pick<(Game), 'phase' | 'round' | 'votes' | 'werewolfVote'>} WerewolfGameWithOmission */
/** Incomplete Game model same as `gameWithOmissions` but for seer
 * @typedef {Pick<(Game), 'phase' | 'round' | 'votes' | 'seerVote' | 'seerPeekedAliasIds'>} SeerGameWithOmission */

/** Game model's player property but as public game player
* @typedef {{players: PublicGamePlayer[]}} WithPublicPlayer */

/** public game model
 * @typedef {GameWithOmission & WithPublicPlayer} PublicGame */
/** public game model for werewolves.
 * Has `alhpaWolf` prop to determine who chooses on werewolf phase.
 * @typedef {WerewolfGameWithOmission & WithPublicPlayer & {alphaWolf: string}} WerewolfPublicGame
 * */
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
        seerPeekedAliasIds: [],
        werewolfVote: undefined,
        seerVote: undefined
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
    const { phase, round, votes } = game;
    return { phase, round, votes, players: publicGamePlayers };
}
/** get desensitized game state for werewolves
 * @param {PublicGamePlayer[]} publicGamePlayers
 * @param {string} alphaWolf
 * @param {Game} game 
 * @returns {WerewolfPublicGame}
 * */
function getWerewolfGame(publicGamePlayers, alphaWolf, game) {
    const { phase, round, votes, werewolfVote } = game;
    return { phase, round, votes, werewolfVote, alphaWolf, players: publicGamePlayers };
}
/** get desensitized game state for seer
 * @param {PublicGamePlayer[]} publicGamePlayers
 * @param {Game} game 
 * @returns {SeerPublicGame}
 * */
function getSeerPublicGame(publicGamePlayers, game) {
    const { phase, round, votes, seerVote, seerPeekedAliasIds } = game;
    return { phase, round, votes, seerVote, seerPeekedAliasIds, players: publicGamePlayers };
}


module.exports = {
    createNewGame,
    setGamePlayers,
    getPublicGame,
    getWerewolfGame,
    getSeerPublicGame
}