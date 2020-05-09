// @ts-check

/** @typedef {import('socket.io')} SocketIO */
/** @typedef {import('../game.service')} GameService */
/** @typedef {import('../../models/game').Game} Game */
/** @typedef {import('../../models/game').PublicGame} PublicGame */
/** @typedef {import('../../models/game').SeerPublicGame} SeerPublicGame */
/** @typedef {import('../../models/game-player').GamePlayer} GamePlayer */
/** @template T 
 * @typedef {import('../../models/response').CallbackFn<T>} CallbackFn */

 const { conditionalMap, noop } = require('../../util')
 const GameService = require('../game.service')
 const { createSuccessResponse, createFailedResponse } = require('../../models/response');
 const { werewolfRole, villagerRole, seerRole, isWereWolf, isSeer, isVillager, getPublicGamePlayer } = require('../../models/game-player')
 const { getPublicGame, getWerewolfGame, getSeerPublicGame } = require('../../models/game')
 module.exports = class gameIoService {
     #gameNs = '/game';
     #joinGameEvent = 'joinGame';
     #voteEvent = 'vote';
     #leaveGameEvent = 'leaveGame';
     #restartGameEvent = 'restartGame';
 
     #gameUpdatedEmit = 'gameUpdated';
     #gameRestartedEmit = 'gameRestarted';
 
     /** @type {SocketIO.Server} */
     #io;
     /** @type {SocketIO.Namespace} */
     #gameIo;
     /** @type {GameService} */
     #gameService;
 
     /** 
      * @param {SocketIO.Server} io
      * @param {GameService} gameService
      */
     constructor(io, gameService) {
         this.#io = io;
         this.#gameIo = this.#io.of(this.#gameNs)
         this.#gameService = gameService;
 
         this.#gameService.on(
             GameService.gameUpdatedEvent,
             this.#emitGameUpdates
         );
 
         this.#gameIo.on('connect', socket => {
             socket.on(this.#joinGameEvent, this.onJoinGame(socket));
             socket.on(this.#voteEvent, this.vote)
             socket.on(this.#leaveGameEvent, this.onLeaveGame(socket));
             socket.on('disconnect', this.onLeaveGame(socket));
             socket.on(this.#restartGameEvent, this.restartGame)
         })
     }
     /** 
      * @param {Game} game
      */
     #emitGameUpdates = (game) => {
         console.log(game)
         const werewolfGameState = this.#createWerewolfGameState(game)
         const villagerGameState = this.#createVillagerGameState(game)
         const seerGameState = this.#createSeerGameState(game)
         game.players.forEach(pl => {
             if (isWereWolf(pl)) {
                 this.#gameIo.to(pl.socketId).emit(
                     this.#gameUpdatedEmit,
                     werewolfGameState
                 );
             }
             else if (isVillager(pl)) {
                 this.#gameIo.to(pl.socketId).emit(
                     this.#gameUpdatedEmit,
                     villagerGameState
                 )
             }
             else if (isSeer(pl)) {
                 this.#gameIo.to(pl.socketId).emit(
                     this.#gameUpdatedEmit,
                     seerGameState
                 )
             }
         });
     }
     /** fn to provide socket to actual joinGame fn
      * @param {SocketIO.Socket} socket */
     onJoinGame = socket =>
         /** player joins game
          * @param {string} playerId
          * @param {CallbackFn<undefined>} cb
          * */
         (playerId, cb = noop) => {
             try {
                 this.#gameService.joinGame(socket.id, playerId);
                 cb(createSuccessResponse())
             } catch (err) {
                 const errorMessage = err && err.message
                     ? err.message
                     : `Unclear error occured. Contact dev.`
                 console.log('error', errorMessage);
                 cb(createFailedResponse(errorMessage));
             }
         }
     /** fn to provide socket to actual leave game fn
      * @param {SocketIO.Socket} socket */
     onLeaveGame = socket =>
         /** player leaves game
          */
         () => {
             try {
                 this.#gameService.leaveGame(socket.id);
             } catch (err) {
                 const errorMessage = err && err.message
                     ? err.message
                     : `Unclear error occured. Contact dev.`
                 console.log('error', errorMessage);
             }
         }
     /** vote a player. `playerId` for authenticity.
      * @param {string} aliasId
      * @param {string} playerId
      * @param {CallbackFn<undefined>} cb
      */
     vote = (aliasId, playerId, cb = noop) => {
         try {
             this.#gameService.vote(aliasId, playerId);
             cb(createSuccessResponse());
         } catch(err) {
             const errorMessage = err && err.message
                 ? err.message
                 : `Unclear error occured. Contact dev.`
             console.error('error', errorMessage);
             cb(createFailedResponse(errorMessage));
         }
     }
 
     /** restart game with current players.
      * @param {string} playerId
      * @param {CallbackFn<undefined>} cb
      */
     restartGame = (playerId, cb = noop) => {
         try {
             this.#gameService.restartGame(playerId);
             cb(createSuccessResponse());
             this.#gameIo.emit(this.#gameRestartedEmit);
         } catch (err) {
             const errorMessage = err && err.message
                 ? err.message
                 : `Unclear error occured. Contact dev.`
             console.error('error', errorMessage);
             cb(createFailedResponse(errorMessage));
         }
     }
 
     /** create state for werewolf players
      * @param {Game} game
      * @returns {PublicGame} */
     #createWerewolfGameState = (game) => {
         const publicPlayers = conditionalMap(
             pl => !isWereWolf(pl) && pl.isAlive,
             pl => ({ ...pl, role: villagerRole }),
             game.players
         ).map(getPublicGamePlayer);
         const alpha = game.players.find(pl => pl.role === werewolfRole);
         return getWerewolfGame(
             publicPlayers,
             alpha.aliasId,
             game
         )
     }
     /** create state for villager players
      * @param {Game} game
      * @returns {PublicGame} */
     #createVillagerGameState = (game) => {
         const publicPlayers = conditionalMap(
             pl => pl.isAlive,
             pl => ({ ...pl, role: villagerRole }),
             game.players
         ).map(getPublicGamePlayer);
         return getPublicGame(
             publicPlayers,
             game
         );
     }
     /** create state for seer players
      * @param {Game} game
      * @returns {SeerPublicGame} */
     #createSeerGameState = (game) => {
         const publicPlayers = conditionalMap(
             pl => !isSeer(pl) && pl.isAlive &&
                 !game.seerPeekedAliasIds.some(aId => pl.aliasId === aId),
             pl => ({ ...pl, role: villagerRole }),
             game.players
         ).map(getPublicGamePlayer);
         return getSeerPublicGame(
             publicPlayers,
             game
         )
     }
 }
 