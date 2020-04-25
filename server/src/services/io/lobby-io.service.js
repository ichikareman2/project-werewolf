// @ts-check

/** @template T
 * @typedef {import('../../models/response').CallbackFn<T>} CallbackFn<T> */
/** @typedef {import('../player.service')} PlayerService */
/** @typedef {import('../lobby.service')} LobbyService */
/** @typedef {import('../game.service')} GameService */
/** @typedef {import('../../models/lobby').Lobby} Lobby */
/** @typedef {import('../../models/lobby').PublicLobbyPlayer} PublicLobbyPlayer */
/** @typedef {import('../../models/player').Player} Player */
/** @typedef {import('../../models/response').FailedResponse} FailedResponse */
/** @template T
 * @typedef {import('../../models/response').SuccessResponse<T>} SuccessResponse<T> 
*/
/** @typedef {import('socket.io')} SocketIO */
/**# Imports */
const LobbyService = require('../lobby.service');
const GameService = require('../game.service');
const { createFailedResponse, createSuccessResponse } = require('../../models/response');
const { getPublicPlayer } = require('../../models/player');
const { createPublicLobbyPlayer } = require('../../models/lobby');
const { noop } = require('../../util');

module.exports = class LobbyIoService {
    #lobbyNs = '/lobby';
    #joinLobbyEvent = 'joinLobby';
    #leaveLobbyEvent = 'leaveLobby';
    #getLobbyPlayersEvent = 'getLobbyPlayers';
    #gameStartEvent = 'gameStart';

    #playerListEmit = 'playerList';
    #gameStartedEmit = 'gameStarted'
    #lobbyRoomName = 'lobbyRoom';
    /** @type {SocketIO.Server} */
    #io;
    /** @type {LobbyService} */
    #lobbyService;
    /** @type {PlayerService} */
    #playerService;
    /** @type {GameService} */
    #gameService;
    /** io of lobby namespace 
     * @type {SocketIO.Namespace} */
    #lobbyIo;

    /** Initialize Lobby Socket IO service
     * @param {SocketIO.Server} io 
     * @param {LobbyService} lobbyService 
     * @param {PlayerService} playerService
     * @param {GameService} gameService
     */
    constructor(io, lobbyService, playerService, gameService) {
        this.#io = io;
        this.#lobbyService = lobbyService;
        this.#playerService = playerService;
        this.#gameService = gameService
        this.#lobbyIo = this.#io.of(this.#lobbyNs);
        this.#lobbyService.on(LobbyService.lobbyUpdatedEvent, this.emitLobbyUpdates)

        this.#lobbyIo.on('connect', socket => {
            socket.on(this.#joinLobbyEvent, this.onJoinLobby(socket));
            socket.on(this.#leaveLobbyEvent, this.onLeaveLobby(socket));
            socket.on(this.#gameStartEvent, this.onStartGame(socket));
            socket.on('disconnect', this.onLeaveLobby(socket));

            socket.on(this.#getLobbyPlayersEvent, this.getLobbyPlayers);
        })
    }

    /** players without sensitive info. 
     * @param {Lobby} [lobby]
    * @returns {Promise<PublicLobbyPlayer[]>} */
    getPublicLobbyPlayers = async (lobby) => {
        const lobbyPlayers = (lobby && lobby.players) ? lobby.players : await this.#lobbyService.getPlayers();
        const playerIds = lobbyPlayers.map(x => x.playerId);
        const players = await this.#playerService.getPlayersByIds(playerIds);
        return lobbyPlayers.map(lobbyPl => {
            const matchingPl = players.find(pl => pl.id === lobbyPl.playerId);
            return createPublicLobbyPlayer(matchingPl.aliasId, matchingPl.name, lobbyPl.isHost);
        });
    }

    /** emit updates to sockets in the room.
     * @note was previously emitting to a room, but somehow, on reUp of server, 
     * the sockets are still in the room.
     * @param {Lobby} lobby
     */
    emitLobbyUpdates = async (lobby) => {
        const publicPlayers = await this.getPublicLobbyPlayers(lobby);
        lobby.players.forEach(x => this.#lobbyIo.to(x.socketId)
            .emit(this.#playerListEmit, publicPlayers));
    }

    /** function to provide `socket` to actual function
     * @param {SocketIO.Socket} socket */
    onJoinLobby = socket =>
        /** 
         * @function joinLobby
         * @param {string} id
         * @param {CallbackFn<void>} [cb]
         */
        async (id, cb = noop) => {
            const playerFound = await this.#playerService.getPlayerById(id)
            if (!playerFound) { 
                cb(createFailedResponse('player not found')) 
                return;
            }
            const lobby = await this.#lobbyService.upsertPlayer(playerFound.id, socket.id);
            cb(createSuccessResponse(undefined));
        };

    /** fn to provide `socket` to actual leaveLobby fn
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
     * @param {CallbackFn<PublicLobbyPlayer[]>} cb
     * [cb] callback
     * @returns {Promise<void>}
     */
    getLobbyPlayers = async (id, cb = noop) => {
        if (!this.#lobbyService.getPlayerById(id)) {
            cb(createFailedResponse('player not in room'));
            return;
        }
        cb(createSuccessResponse(await this.getPublicLobbyPlayers()));
    }
    /** fn to provide socket to actual start game fn
     * @param {SocketIO.Socket} socket */
    onStartGame = socket => 
        /** start game.
         * @param {CallbackFn<PublicLobbyPlayer[]>} cb */
        async (cb = noop) => {
            try {
                const players = await this.#lobbyService.getPlayers();
                const starterIsHost = players.find(x => x.socketId === socket.id).isHost;
                if(!starterIsHost) { throw new Error('player is not host.') }
                await this.#gameService.startGame(players);
                cb(createSuccessResponse());
                players.forEach(x => this.#lobbyIo.to(x.socketId)
                    .emit(this.#gameStartedEmit));
            } catch (err) {
                const errorMessage = err && err.message ? err.message : `Unclear error occured. Contact dev.`
                console.log('error', errorMessage);
                cb(createFailedResponse(errorMessage));
            }
        }
}