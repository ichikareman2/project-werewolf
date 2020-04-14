/** @typedef {import('./player').Player} Player */
/** @typedef {import('./player').PublicPlayer} PublicPlayer */
/** 
 * @typedef {Object} GamePlayerStatus
 * @property {boolean} alive
 * @property {string} causeOfDeath
 * @property {Role} role
 */
/**
 * @typedef {GamePlayerStatus & Player} GamePlayer
 */
/**
 * @enum string
 * @readonly
 */
const Role = {
  VILLAGER: 'villager',
  WEREWOLF: 'Werewolf',
  SSER: 'Seer',
}

/**
 * create a player for the game
 * @param {Player} player a player from lobby
 * @param {Role} role role of the player
 * @returns {GamePlayer}
 */
function createGamePlayer(player, role) {
  return {
    ...player,
    alive: true,
    causeOfDeath: '',
    role
  }
}
/**
 * change alive status and state reason of death
 * @param {string} causeOfDeath cause of player's death
 * @param {GamePlayer} player player object to update
 * @returns {GamePlayer}
 */
function killPlayer(causeOfDeath, player) {
  return {
    ...player,
    alive: false,
    causeOfDeath
  }
}

module.exports = {
  Role,
  createGamePlayer,
  killPlayer
}
