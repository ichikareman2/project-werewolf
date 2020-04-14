// @ts-check
/** @typedef {import('./player').Player} Player */
/** @typedef {Map<string, Player>} PlayerMap */

/** create an empty playerMap
 * @returns {PlayerMap}
 */
function createNewPlayerMap() {
  return new Map()
}
/** Create a map from list of players
 * @param {Player[]} playerArr array of `Player`s
 * @returns {PlayerMap}
 */
function createNewPlayerMapFromList(playerArr) {
  return new Map(playerArr.map(pl => [pl.id, pl]));
}
/** Convert `PlayerMap` to `Player[]`
 * @param {PlayerMap} playerMap player map to convert
 */
function playerMapToArray(playerMap) {
  return [...playerMap.values()]
}
/** get `Player` from `Map` by `id`
 * @param {string} id id of player to get
 * @param {PlayerMap} playerMap `Map` of player
 * @returns {Player}
 */
function getPlayerByIdMap(id,playerMap) {
  return playerMap.get(id);
}

/** Get `Player` from `Map` by `fn`
 * @param {(Player) => boolean} playerFindFn function to match player
 * @param {PlayerMap} playerMap `Map` of player
 * @returns {Player}
 */
function findPlayer(playerFindFn, playerMap) {
  for(let player of playerMap.values()) {
    if(playerFindFn(player)) {
      return player
    }
  }
}
/** add a player to map
 * @param {Player} player `Player` to add
 * @param {PlayerMap} PlayerMap Map to add the player to
 * @sideeffect
 */
function addPlayer(player, PlayerMap) {
  return PlayerMap.set(player.id, player);
}
module.exports = {
  createNewPlayerMap,
  createNewPlayerMapFromList,
  playerMapToArray,
  getPlayerByIdMap,
  findPlayer,
  addPlayer
}
