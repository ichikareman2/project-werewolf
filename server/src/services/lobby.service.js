// @ts-check

/** @typedef {import('../models/lobby').Lobby} Lobby */
/** @typedef {import('../models/lobby').LobbyPlayer} LobbyPlayer */

const { EventEmitter } = require('events');
const {
    findPlayerInLobby,
    createNewLobby,
    upsertPlayerToLobby,
    removePlayerfromLobby
} = require('../models/lobby');

/** Manage Lobby store */
module.exports = class LobbyService extends EventEmitter {
    /** event name for when lobby players are updated */
    static lobbyUpdatedEvent = 'lobbyPlayersUpdated';
    /** lobby store
     * @type {Lobby}
     */
    #lobby = createNewLobby();

    constructor() {
        super();
    }
    /** set lobby. returns updated lobby.
     * @private
     * @param {Lobby} lobby
     * @returns {Lobby}
     */
    #setLobby = (lobby) => {
        this.#lobby = lobby;
        this.emit(LobbyService.lobbyUpdatedEvent, lobby);
        return this.#lobby;
    }
    /** insert player. if exists, update player.
     * @param {string} playerId
     * @param {string} socketId
     * @returns {Promise<Lobby>}
     */
    upsertPlayer = async (playerId, socketId) => {
        return this.#setLobby(upsertPlayerToLobby(playerId, socketId, this.#lobby));
    }
    /** get player by socket Id
     * @param {string} socketId
     * @returns {Promise<LobbyPlayer>}
     */
    getPlayerBySocketId = async (socketId) => {
        return findPlayerInLobby(pl => socketId === pl.socketId, this.#lobby);
    }
    /** get player by player Id
    * @param {string} id player id
    * @returns {Promise<LobbyPlayer>}
    */
    getPlayerById = async (id) => {
        return findPlayerInLobby(pl => id === pl.playerId, this.#lobby);
    }
    /** get all lobby players
     * @returns {Promise<LobbyPlayer[]>}
     */
    getPlayers = async () => {
        return this.#lobby.players;
    }
    /** Remove player by socket id
     * @param {string} socketId
     * @returns {Promise<Lobby>}
     */
    removePlayer = async (socketId) => {
        if (!(await this.getPlayerBySocketId(socketId))) { return this.#lobby; }
        return this.#setLobby(removePlayerfromLobby(socketId, this.#lobby))
    }
}