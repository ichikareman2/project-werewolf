// @ts-check
const uuid = require('uuid').v4
/** player object
 * @typedef {Object} Player
 * @property {string} id unique identifier. stored in browser
 * @property {string} aliasId identifier for when other players reference a player. For security reasons.
 * @property {string} name name of the player
 */
/** Player object without sensitive data
 * @typedef {Omit<Player, 'id'>} PublicPlayer */

/** Create a new player
 * @param name {string} name of player
 * @returns {Player}
 */
function createNewPlayer(name) {
  return {
    id: uuid(),
    aliasId: uuid(),
    name
  }
}

/** Update a player's name
 * @param {string} name new name for the player
 * @param {Player} player player object to update
 */
function updatePlayerName(name, player) {
  return {
    ...player,
    name
  }
}

/** Get a player from list by id
 * @param {string} id id of player to search
 * @param {Player[]} players play list to search from
 * @returns {Player}
 */
function getPlayerById(id, players) {
  return players.find(x => x.id === id)
}
/** Get a player from list by multiple ids
 * @param {string[]} ids id list of players to search
 * @param {Player[]} players play list to search from
 * @returns {Player[]}
 */
function getPlayersByIds(ids, players) {
  return players.filter(x => ids.indexOf(x.id) > -1)
}
/** Update a player
 * @param {(pl: Player) => boolean} playerFindFn 
 * @param {(pl: Player) => Player} playerUpdateFn 
 * @param {Player[]} players 
 * @returns {Player[]}
 */
function updatePlayer(playerFindFn, playerUpdateFn, players) {
  const playerToUpdate = players.find(playerFindFn);
  const updatedPlayer = playerUpdateFn(playerToUpdate);
  return players.map(p => p === playerToUpdate ? updatedPlayer : p);
}
/** Create player object without sensitive data
 * @param {Player} player `Player` to transform
 * @returns {PublicPlayer}
 */
function getPublicPlayer({ aliasId, name }) {
  return { aliasId, name }
}

/** Add player to list
 * @param {Player} player player to add
 * @param {Player[]} players player list to add player to
 * @returns {Player[]}
 */
function addPlayer(player, players) {
  return [...players,player];
}

module.exports = {
  createNewPlayer,
  updatePlayerName,
  getPlayerById,
  getPlayersByIds,
  updatePlayer,
  addPlayer,
  getPublicPlayer
}
