// @ts-check

/** @typedef {import('../models/game').Game} Game */
/** @typedef {import('../models/game').PublicGame} PublicGame */
/** @typedef {import('../models/game').SeerPublicGame} SeerPublicGame */
/** @typedef {import('../models/game-player').GamePlayer} GamePlayer */
/** @typedef {import('../models/player').Player} Player */
/** @typedef {import('../models/lobby').LobbyPlayer} LobbyPlayer */
/** @typedef {import('../services/player.service')} PlayerService */

const { EventEmitter } = require('events');
const { conditionalMap } = require('../util');
const { createNewGame, setGamePlayers, getPublicGame, getSeerPublicGame } = require('../models/game');
const { createGamePlayer, createShuffledRoles, updateGamePlayerInList, setGamePlayerSocketId, killPlayer } = require('../models/game-player');
const { DayPhaseEnum, NightPhaseEnum, getNextGamePhase } = require('../models/game-phase');
const { werewolfRole, villagerRole, seerRole, getPublicGamePlayer } = require('../models/game-player');
const { upsertVote } = require('../models/vote');

module.exports = class GameService extends EventEmitter {
    /** event name for when game state is updated. */
    static gameUpdatedEvent = 'gameUpdated';
    /** Status of the game */
    #gameState = createNewGame();
    /** player service
     * @type {PlayerService}
     */
    #playerService;
    /** create a new game service to manage game.
     * @param {PlayerService} playerService 
     */
    constructor(playerService) {
        super();
        this.#playerService = playerService;
    }
    /** update game state and emit updated state.
     * @param {Game} game */
    #updateGameState = (game) => {
        this.#gameState = game;
        this.emit(GameService.gameUpdatedEvent, game);
    }
    /** 
     * @param {LobbyPlayer[]} lobbyPlayers 
     */
    startGame = async (lobbyPlayers) => {
        if (!(Array.isArray(lobbyPlayers) && lobbyPlayers.length > 0)) {
            throw new Error(`players cannot be null`);
        }
        if (lobbyPlayers.length < 5) {
            throw new Error(`players must be at least 5 to start.`);
        }
        const roles = createShuffledRoles(lobbyPlayers.length);
        const players = await this.#playerService.getPlayersByIds(
            lobbyPlayers.map(x => x.playerId)
        );
        const hostId = lobbyPlayers.find(x => x.isHost).playerId;
        const gamePlayers = players
            .map((pl, i) =>
                createGamePlayer({ ...pl, isHost: pl.id === hostId }, roles[i]))
        let newGameState = createNewGame();
        newGameState = setGamePlayers(gamePlayers, newGameState);
        this.#updateGameState(newGameState);
        return;
    }
    /**
     * @param {string} playerId
     * @param {string} socketId
     */
    joinGame = (socketId, playerId) => {
        if (!(playerId && socketId)) { throw new Error(`playerId cannot be empty`) }
        const game = this.#gameState;
        if(game.players.findIndex(pl => pl.id === playerId) === -1) {
            throw new Error(`player is not part of the game`)
        }
        const players = updateGamePlayerInList(
            pl => pl.id === playerId,
            pl => setGamePlayerSocketId(socketId, pl),
            game.players
        );
        this.#updateGameState({ ...game, players });
    }
    /**
     * @param {string} aliasId
     * @param {string} voterPlayerId
     */
    vote = (aliasId, voterPlayerId) => {
        if (!(aliasId && voterPlayerId)) {
            throw new Error(`alias cannot be empty`);
        }
        // get phase
        const phase = this.#gameState.phase;
        // delegate to specific vote functions. should return new game state
        if (phase.roundPhase === DayPhaseEnum.VILLAGERSVOTE) {
            return this.#villagerVote(aliasId, voterPlayerId)
        } else if (phase.roundPhase === NightPhaseEnum.WEREWOLVESHUNT) {
            return this.#werewolfVote(aliasId, voterPlayerId)
        } else if (phase.roundPhase === NightPhaseEnum.WEREWOLVESHUNT) {
            return this.#seerVote(aliasId, voterPlayerId)
        }
        // check if all required voters has voted
        // if true, process vote, and get a new game state
        // if false, dont process vote
        // save game
    }
    #villagerVote = (aliasId, voterPlayerId) => {
        const state = this.#gameState;
        // check if villagers vote phase
        // check if aliasId is alive
        state.players.find(x => x.aliasId === aliasId);
        // check if voterPlayerId is alive
        state.players.find(x => x.id === voterPlayerId);

        // add villager vote
        const newVotes = upsertVote(voterPlayerId, aliasId, state.votes);
        let newGameState = { ...this.#gameState, votes: newVotes };
        // process vote?
        const allAliveVillagersVoted =
            newGameState.players.filter(x => x.isAlive).length === newGameState.votes.length;
        if (!allAliveVillagersVoted) { return newGameState; }
        const majorityVoteCount = Math.ceil(newGameState.players.filter(x => x.isAlive).length / 2)
        const tally = newGameState.votes.reduce((acc, curr) => {
            const voted = acc.get(curr.votedAliasId);
            if (!voted) { acc.set(curr.votedAliasId, 1); }
            else { acc.set(curr.votedAliasId, voted + 1); }
            return acc;
        }, new Map());
        let votedOut = undefined;
        for (let entry of tally) {
            entry[1] >= majorityVoteCount;
        }
        let newPlayers = newGameState.players;
        if (votedOut !== undefined) {
            newPlayers = updateGamePlayerInList(
                pl => pl.aliasId === votedOut[0],
                pl => killPlayer('', pl),
                newPlayers
            );
        }
        newGameState = {
            ...newGameState,
            phase: getNextGamePhase(newGameState.phase),
            players: newPlayers
        };

    }
    #werewolfVote = (aliasId, voterPlayerId) => {
        // check if werewolf vote phase
        // check if voter is alive
        // check if aliasId is alive
        // check if voter is werewolf

        // add werewolfVote
        // process vote?
    }
    #seerVote = (aliasId, voterPlayerId) => {
        // check if seer vote phase
        // check if voter is alive
        // check if aliasId is alive
        // check if voter is seer

        // add seer vote
        // process vote?
    }
}