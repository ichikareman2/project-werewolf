// @ts-check

/** @typedef {import('socket.io')} SocketIO */
/** @typedef {import('../game.service')} GameService */
/** @typedef {import('../../models/game').Game} Game */
/** @typedef {import('../../models/game-player').GamePlayer} GamePlayer */
/** @template T 
 * @typedef {import('../../models/response').CallbackFn<T>} CallbackFn */

 const { conditionalMap, noop } = require('../../util')
 const GameService = require('../game.service')
 const { createFailedResponse } = require('../../models/response');
 const { werewolfRole, villagerRole, seerRole, isWereWolf, isSeer, isVillager, getPublicGamePlayer } = require('../../models/game-player')
 const { getPublicGame, getSeerPublicGame } = require('../../models/game')
 module.exports = class gameIoService {
     #gameNs = '/game';
     #joinGameEvent = 'joinGame';
     
     #gameUpdatedEmit = 'gameUpdated'
     
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
             if(isWereWolf(pl)) { 
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
     /** fn to provide socket to actual joinGame */
     onJoinGame = socket =>
         /** player joins game
          * @param {string} playerId
          * @param {CallbackFn<undefined>}
          * */
         (playerId, cb = noop) => {
             try{
                 this.#gameService.joinGame(socket.id, playerId);
                 cb()
             } catch(err) {
                 const errorMessage = err && err.message ? err.message : `Unclear error occured. Contact dev.`
                 console.log('error', errorMessage);
                 cb(createFailedResponse(errorMessage));
             }
         }
     /** create state for werewolf players
      * @param {Game} game
      */
     #createWerewolfGameState = (game) => {
         const publicPlayers = conditionalMap(
             pl => !isWereWolf(pl) && pl.isAlive,
             pl => ({ ...pl, role: villagerRole }),
             game.players
         ).map(getPublicGamePlayer);
         return getPublicGame(
             publicPlayers,
             game
         )
     }
     #createVillagerGameState = (game) => {
         const publicPlayers = conditionalMap(
             pl => pl.isAlive,
             pl => ({...pl, role: villagerRole}),
             game.players
         ).map(getPublicGamePlayer);
         return getPublicGame(
             publicPlayers,
             game
         );
     }
     #createSeerGameState = (game) => {
         const publicPlayers = conditionalMap(
             pl => !isSeer(pl) && pl.isAlive,
             pl => ({...pl, role: villagerRole}),
             game.players
         ).map(getPublicGamePlayer);
         return getSeerPublicGame(
             publicPlayers,
             game
         )
     }
 }