// @ts-check


/** @typedef {import('../player.service')} PlayerService */
/** @typedef {import('../lobby.service')} LobbyService */
/** @typedef {import('../../models/lobby').Lobby} Lobby */
/** @typedef {import('../../models/player').Player} Player */
/** @typedef {import('../../models/player').PublicPlayer} PublicPlayer */
/** @typedef {import('../../models/response').FailedResponse} FailedResponse */
/** @template T
 * @typedef {import('../../models/response').SuccessResponse<T>} SuccessResponse<T> 
*/
/** @typedef {import('socket.io')} SocketIO */
/**# Imports */
const LobbyService = require('../lobby.service');
const { createFailedResponse, createSuccessResponse } = require('../../models/response');
const { noop } = require('../../util');
const { getPublicPlayer } = require('../../models/player');

module.exports = class LobbyIoService {
    #lobbyNs = '/lobby';
    #joinLobbyEvent = 'joinLobby';
    #leaveLobbyEvent = 'leaveLobby';
    #getLobbyPlayersEvent = 'getLobbyPlayers';
    #playerListEmit = 'playerList';
    #lobbyRoomName = 'lobbyRoom';
    /** @type {SocketIO.Server} */
    #io;
    /** @type {LobbyService} */
    #lobbyService;
    /** @type {PlayerService} */
    #playerService;
    /** io of lobby namespace 
     * @type {SocketIO.Namespace} */
    #lobbyIo;

    /** Initialize Lobby Socket IO service
     * @param {SocketIO.Server} io 
     * @param {LobbyService} lobbyService 
     * @param {PlayerService} playerService
     */
    constructor(io, lobbyService, playerService) {
        this.#io = io;
        this.#lobbyService = lobbyService;
        this.#playerService = playerService;
        this.#lobbyIo = this.#io.of(this.#lobbyNs);
        this.#lobbyService.on(LobbyService.lobbyUpdatedEvent, this.emitLobbyUpdates)

        this.#lobbyIo.on('connect', socket => {
            socket.on(this.#joinLobbyEvent, this.onJoinLobby(socket));
            socket.on(this.#leaveLobbyEvent, this.onLeaveLobby(socket));
            socket.on('disconnect', this.onLeaveLobby(socket));
            socket.on(this.#getLobbyPlayersEvent, this.getLobbyPlayers);
        })
    }

    /** players without sensitive info. 
     * @param {Lobby} [lobby]
    * @returns {Promise<PublicPlayer[]>} */
    getLobbyPlayersPublic = async (lobby) => {
        const lobbyPlayers = (lobby && lobby.players) ? lobby.players : await this.#lobbyService.getPlayers();
        const playerIds = lobbyPlayers.map(x => x.playerId)
        const players = await this.#playerService.getPlayersByIds(playerIds)
        return players.map(getPublicPlayer)
    }

    /** emit updates to sockets in the room.
     * @note was previously emitting to a room, but somehow, on reUp of server, 
     * the sockets are still in the room.
     * @param {Lobby} lobby
     */
    emitLobbyUpdates = async (lobby) => {
        const publicPlayers = await this.getLobbyPlayersPublic(lobby);
        lobby.players.forEach(x => this.#lobbyIo.to(x.socketId)
            .emit(this.#playerListEmit, publicPlayers));
    }

    /** function to provide `socket` to actual function
     * @param {SocketIO.Socket} socket */
    onJoinLobby = socket =>
        /** 
         * @function joinLobby
         * @param {string} id
         * @param {(a:FailedResponse | SuccessResponse<undefined>) => void} [cb]
         */
        async (id, cb = noop) => {
            const playerFound = await this.#playerService.getPlayerById(id)
            if (!playerFound) { cb(createFailedResponse('player not found')) }
            await this.#lobbyService.upsertPlayer(playerFound.id, socket.id);
            cb(createSuccessResponse(undefined));
        };

    /** dn to provide `socket` to actual leaveLobby fn
     * @param {SocketIO.Socket} socket */
    onLeaveLobby = socket =>
        /** remove player from lobby.
         * @function leaveLobby
         * @returns {Promise<void>}
         */
        async () => { this.#lobbyService.removePlayer(socket.id); }

    /** get players currently in lobby
     * @function getLobbyPlayers
     * @param {string} id
     * @param {(a:FailedResponse | SuccessResponse<PublicPlayer[]>) => void} 
     * [cb] callback
     * @returns {Promise<void>}
     */
    getLobbyPlayers = async (id, cb = noop) => {
        if (!this.#lobbyService.getPlayerById(id)) {
            cb(createFailedResponse('player not in room'));
        }
        cb(createSuccessResponse(await this.getLobbyPlayersPublic()));
    }
}