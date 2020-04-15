// @ts-check
/** represents players in lobby
 * @typedef {Object} LobbyPlayer 
 * @property {string} playerId
 * @property {string} socketId
 * @property {boolean} isHost
 */
/** represents players in lobby but without sensitive data like player
 *   id which can be used to impersonate player
 * @typedef {Object} PublicLobbyPlayer
 * @property {string} aliasId
 * @property {string} name
 * @property {boolean} isHost
 */

/** represents lobby
 * @typedef {Object} Lobby
 * @property {LobbyPlayer[]} players
 */

/** Create a new lobby
 * @returns {Lobby}
 */
function createNewLobby() {
  return {
    players: []
  };
}
/** create a lobby player
 * @param {string} playerId 
 * @param {string} socketId 
 * @param {boolean} [isHost] 
 * @returns {LobbyPlayer}
 */
function createNewLobbyPlayer(playerId, socketId, isHost = false) {
  return {
    playerId,
    socketId,
    isHost
  };
}
/** create a public lobby player
 * @param {string} aliasId 
 * @param {string} name 
 * @param {boolean} isHost 
 */
function createPublicLobbyPlayer(aliasId, name, isHost) {
  return {
    aliasId,
    name,
    isHost
  };
}
/** assign player as host
 * @param {LobbyPlayer} player 
 * @returns {LobbyPlayer}
 */
function makePlayerHost(player) {
  return {
    ...player,
    isHost: true
  }
}
/** Add player to lobby
 * @param {LobbyPlayer} lobbyPlayer
 * @param {Lobby} lobby current lobby
 * @returns {Lobby}
 */
function upsertPlayerToLobby(lobbyPlayer, lobby) {
  const indexOfPlayer = lobby.players.findIndex(x => x.playerId === lobbyPlayer.playerId)
  if (indexOfPlayer > -1) {
    const players = [...lobby.players];
    players[indexOfPlayer] = lobbyPlayer;
    return { players };
  }
  return { players: [ ...lobby.players, lobbyPlayer ] };
}

/** Find player in lobby through matchFn
 * @param {(pl: LobbyPlayer) => boolean} matchFn function to match lobby player
 * @param {Lobby} lobby lobby object
 * @returns {LobbyPlayer}
 */
function findPlayerInLobby(matchFn, lobby) {
  return lobby.players.find(matchFn);
}
/** Remove a player from lobby
 * @param {string} socketId socket id of player to remove
 * @param {Lobby} lobby Lobby object to update
 * @returns {Lobby} udpated lobby
 */
function removePlayerfromLobby(socketId, lobby) {
  return { players: lobby.players.filter(x => x.socketId !== socketId) };
}

module.exports = {
  createNewLobby,
  upsertPlayerToLobby,
  findPlayerInLobby,
  removePlayerfromLobby,
  createNewLobbyPlayer,
  createPublicLobbyPlayer,
  makePlayerHost
}
