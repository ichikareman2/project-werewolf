// @ts-check
/**
 * @typedef {Object} LobbyPlayer 
 * @property {string} playerId
 * @property {string} socketId
 */
/**
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
/** Add player to lobby
 * @param {string} playerId new player's id
 * @param {string} socketId new player's socket id
 * @param {Lobby} lobby current lobby
 * @returns {Lobby}
 */
function upsertPlayerToLobby(playerId, socketId, lobby) {
  if (lobby.players.some(x => x.playerId === playerId)) {
    return {
      players: lobby.players.map(x =>
        x.playerId === playerId
          ? { playerId, socketId }
          : x
      )
    }
  }
  return {
    players: [
      ...lobby.players,
      { playerId, socketId }
    ]
  }
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
  removePlayerfromLobby
}
