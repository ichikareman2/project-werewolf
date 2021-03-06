// @ts-check

/** @typedef {import('../models/lobby').Lobby} Lobby */
/** @typedef {import('../models/lobby').LobbyPlayer} LobbyPlayer */

const { EventEmitter } = require('events');
const {
    findPlayerInLobby,
    createNewLobby,
    upsertPlayerToLobby,
    removePlayerfromLobby,
    createNewLobbyPlayer,
    makePlayerHost
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
    /** insert player. if exists, update player.
     * @param {string} playerId
     * @param {string} socketId
     * @returns {Promise<Lobby>}
     */
    upsertPlayer = async (playerId, socketId) => {
        const newPlayer = createNewLobbyPlayer(playerId, socketId, false, true);
        let newLobby = upsertPlayerToLobby(newPlayer, this.#lobby);
        newLobby = this.#assignHostPlayer(newLobby);
        return this.#setLobby(newLobby);
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
        let newLobby = removePlayerfromLobby(socketId, this.#lobby);
        newLobby = this.#assignHostPlayer(newLobby);
        return this.#setLobby(newLobby)
    }
    /** kick player.
     * @param {string} playerId - player to kick
     */
    kickPlayer = (playerId) => {
        if (!playerId) { throw new Error(`playerId cannot be empty`); }
        const lobby = this.#lobby;
        const playerIndex = lobby.players.findIndex(pl =>
            pl.playerId === playerId
        );
        if (playerIndex === -1) { throw new Error(`player not in game ${playerId}`); }
        const players = this.#lobby.players.filter(x => x.playerId !== playerId);
        this.#setLobby({ ...lobby, players })
    }
    /** clear lobby */
    clearLobby = () => {
        this.#setLobby(createNewLobby());
    }
    /** mark player as disconnected
     * @param {string} socketId
     */
    disconnectPlayer = (socketId) => {
        console.log(socketId, 'socketid')
        if (!socketId) { throw new Error(`socketId cannot be empty`); }
        const lobby = this.#lobby;
        const playerIndex = lobby.players.findIndex(pl =>
            pl.socketId === socketId
        );
        if (playerIndex === -1) { throw new Error(`player not in game ${socketId}`); }
        const player = { ...lobby.players[playerIndex], socketId: undefined, connected: false };
        const newLobby =  upsertPlayerToLobby(player, lobby);
        this.#setLobby(newLobby)
    }
    /** Assign host to lobby
     * @param {Lobby} lobby
     * @returns {Lobby}
    */
    #assignHostPlayer = (lobby) => {
        if (!(lobby && lobby.players && lobby.players.length > 0)) { return lobby; }
        const host = findPlayerInLobby(pl => pl.isHost, lobby);
        if (host !== undefined) { return lobby; }

        const players = [...lobby.players];
        players[0] = makePlayerHost(lobby.players[0])
        return { players };
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
}