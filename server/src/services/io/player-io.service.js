// @ts-check

/** @typedef {import('../player.service')} PlayerService */
/** @typedef {import('../../models/player').Player} Player */
/** @typedef {import('../../models/response').FailedResponse} FailedResponse */
/** @template T
 * @typedef {import('../../models/response').SuccessResponse<T>} SuccessResponse<T> 
*/
/** @template T
 * @typedef {import('../../models/response').CallbackFn<T>} CallbackFn<T> */
/** @typedef {import('socket.io')} SocketIO */

/**# Imports */
const PlayerService = require('../player.service');
const { createFailedResponse, createSuccessResponse } = require('../../models/response');
const { createNewPlayer, updatePlayerName } = require('../../models/player');
const { noop } = require('../../util');

module.exports = class PlayerIoService {
    #playerNs = '/player';
    #createPlayerEvent = 'createPlayer';
    #getPlayerEvent = 'getPlayer';
    #updatePlayerNameEvent = 'updatePlayerName';
    #playerUpdatedEmit = 'playerUpdated';
    /** @type {SocketIO.Server} */
    #io;
    /** @type {PlayerService} */
    #playerService;
    /** io of player namespace 
     * @type {SocketIO.Namespace}
     */
    #playerIo;

    /** Initialize Player Socket IO service
     * @param {SocketIO.Server} io 
     * @param {PlayerService} playerService 
     */
    constructor(io, playerService) {
        this.#io = io;
        this.#playerService = playerService;
        this.#playerIo = io.of(this.#playerNs);
        this.#playerService.on(PlayerService.playerUpdateEvent, this.#emitPlayerUpdate);

        this.#playerIo.on('connect', socket => {
            socket.on(this.#createPlayerEvent, this.onCreatePlayer(socket));
            socket.on(this.#getPlayerEvent, this.onGetPlayer(socket));
            socket.on(this.#updatePlayerNameEvent, this.updatePlayerName);
        });
    }


    /** socket emit the updated player to themselves
     * @param {Player} player the player that got updated
     */
    #emitPlayerUpdate = (player) =>
        this.#playerIo.to(player.id).emit(this.#playerUpdatedEmit, player);

    /** function to provide `socket` to actual function
     * @param {SocketIO.Socket} socket */
    onCreatePlayer = socket =>
        /** create new player and add to list of players
         * @function createPlayer
         * @param {string} name
         * @param {CallbackFn<Player>} [cb]
         */
        (name, cb = noop) => {
            try {
                const newPlayer = createNewPlayer(name);
                this.#playerService.addPlayer(newPlayer);
                socket.join((newPlayer.id));
                cb(createSuccessResponse(newPlayer))
            } catch (err) {
                console.error(err);
                cb(createFailedResponse(err))
            }
        }

    /** function to provide `socket` to actual function
     * @param {SocketIO.Socket} socket */
    onGetPlayer = socket =>
        /** get player and return as callback parameter
         * @param {string} id
         * @param {CallbackFn<Player>} [cb]
         */
        async (id, cb = noop) => {
            try {
                const player = await this.#playerService.getPlayerById(id);
                if (player !== undefined) { socket.join((player.id)); }
                cb(createSuccessResponse(player))
            } catch (err) {
                console.error(err);
                createFailedResponse(err);
            }
        };
    /** update player name
     * @param {string} id
     * @param {CallbackFn<Player>} [cb]
     */
    updatePlayerName = async (id, name, cb = noop) => {
        try {
            const player = await this.#playerService.getPlayerById(id);
            if (!player) { cb(createFailedResponse('player does not exist.')); }
            const updatedPlayer = updatePlayerName(name, player);
            await this.#playerService.updatePlayer(id, updatedPlayer);
            cb(createSuccessResponse());
        } catch (err) {
            console.error(err);
            createFailedResponse(err);
        }
    }
}