// @ts-check

/** @typedef {import('../models/game').Game} Game */
/** @typedef {import('../models/game').PublicGame} PublicGame */
/** @typedef {import('../models/game').SeerPublicGame} SeerPublicGame */
/** @typedef {import('../models/game-player').GamePlayer} GamePlayer */
/** @typedef {import('../models/player').Player} Player */
/** @typedef {import('../models/lobby').LobbyPlayer} LobbyPlayer */
/** @typedef {import('../services/player.service')} PlayerService */

const { EventEmitter } = require('events');
const { cond } = require('../util');
const { createNewGame, setGamePlayers, setWinnerVillager, setWinnerWerewolves } = require('../models/game');
const { createGamePlayer, createShuffledRoles, updateGamePlayerInList, setGamePlayerSocketId, killPlayer } = require('../models/game-player');
const { getNextGamePhase, dayOrNightEnum } = require('../models/game-phase');
const { werewolfRole, villagerRole, seerRole } = require('../models/game-player');
const { upsertVote, tallyVote } = require('../models/vote');

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
    /** create an instance of the game.
     * @param {Omit<LobbyPlayer, 'socketId'>[]} lobbyPlayers 
     */
    startGame = async (lobbyPlayers) => {
        if (!(Array.isArray(lobbyPlayers) && lobbyPlayers.length > 0)) {
            throw new Error(`players cannot be empty`);
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
    }
    /** player connects. record socketId
     * @param {string} playerId
     * @param {string} socketId
     */
    joinGame = (socketId, playerId) => {
        if (!(playerId && socketId)) { throw new Error(`playerId cannot be empty`); }
        const game = this.#gameState;
        if (game.players.findIndex(pl => pl.id === playerId) === -1) {
            throw new Error(`player is not part of the game`)
        }
        const players = updateGamePlayerInList(
            pl => pl.id === playerId,
            pl => setGamePlayerSocketId(socketId, pl),
            game.players
        );
        this.#updateGameState({ ...game, players });
    }
    /** player disconnects. Remove socketId.
     * @param {string} socketId
     */
    leaveGame = (socketId) => {
        if (!socketId) { throw new Error(`socketId cannot be empty`); }
        const playerIndex = this.#gameState.players.findIndex(pl =>
            pl.socketId === socketId
        );
        if (playerIndex === -1) { throw new Error(`player not in game`); }
        const players = updateGamePlayerInList(
            pl => pl.socketId === socketId,
            pl => setGamePlayerSocketId(undefined, pl),
            this.#gameState.players
        );
        this.#updateGameState({ ...this.#gameState, players })
    }
    /**
     * @param {string} aliasId
     * @param {string} voterPlayerId
     */
    vote = (aliasId, voterPlayerId) => {

        if (!(aliasId && voterPlayerId)) {
            throw new Error(`alias cannot be empty`);
        }
        if(this.#gameState.winner) {
            throw new Error(`Game is completed.`);
        }
        // delegate to specific vote functions. should return new game state
        let newGame = this.#gameState;
        newGame = cond(
            [[
                g => g.phase.dayOrNight === dayOrNightEnum.DAY,
                g => this.#villagerVote(aliasId, voterPlayerId, g)
            ],
            [
                g => g.phase.dayOrNight === dayOrNightEnum.NIGHT && this.#getPlayerRole(voterPlayerId,g) === werewolfRole,
                g => this.#werewolfVote(aliasId, voterPlayerId, g)
            ],
            [
                g => g.phase.dayOrNight === dayOrNightEnum.NIGHT && this.#getPlayerRole(voterPlayerId,g) === seerRole,
                g => this.#seerVote(aliasId, voterPlayerId, g)
            ],
            [() => true, g => {throw new Error('Not a valid vote')}]
            ],
            newGame
        );
        newGame = this.#processDayPhase(newGame);
        // newGame = this.#processWerewolfPhase(newGame);
        // newGame = this.#skipSeerVote(newGame);
        newGame = this.#processNightPhase(newGame);
        newGame = this.#finishGame(newGame);
        this.#updateGameState(newGame);
    }
    /** process villager vote.
     * @param {string} aliasId
     * @param {string} voterPlayerId
     * @param {Game} game
     * @returns {Game}
     */
    #villagerVote = (aliasId, voterPlayerId, game) => {
        // check if villagers vote phase
        // check if voter and voted is alive
        const voted = game.players.find(x => x.aliasId === aliasId);
        const voter = game.players.find(x => x.id === voterPlayerId);
        if (!(voter && voted)) { throw new Error(`Player does not exist.`); }
        if (!(voter.isAlive && voted.isAlive)) {
            throw new Error(`Player is dead.`);
        }

        // add villager vote
        const newVotes = upsertVote(voter.aliasId, aliasId, game.votes);
        return { ...game, votes: newVotes };
    }
    /** process villager vote.
     * @param {string} aliasId
     * @param {string} voterPlayerId
     * @param {Game} game
     * @returns {Game}
     */
    #werewolfVote = (aliasId, voterPlayerId, game) => {
        // check that werewolf vote phase
        // check that voter and voted is alive
        // check that voter is werewolf
        // check that voted is not werewolf
        const voted = game.players.find(x => x.aliasId === aliasId);
        const voter = game.players.find(x => x.id === voterPlayerId);
        if (!(voter && voted)) { throw new Error(`Player does not exist.`); }
        if(!(voter.isAlive && voted.isAlive)) {throw new Error(`Player is dead.`)}
        if (!(voter.role === werewolfRole)) {
            throw new Error(`Player is not a werewolf.`)
        }
        if(!(voted.role !== werewolfRole)) {
            throw new Error(`Voted player should not be a werewolf.`);
        }

        // add werewolfVote
        return { ...game, werewolfVote: aliasId };
    }
    /** process villager vote.
     * @param {string} aliasId
     * @param {string} voterPlayerId
     * @param {Game} game
     * @returns {Game}
     */
    #seerVote = (aliasId, voterPlayerId, game) => {
        // check if seer vote phase
        // check if voter is seer
        // check that voter and voted is alive
        // check that voter is seer
        // check that voted is not in seer peeked yet
        const voted = game.players.find(x => x.aliasId === aliasId);
        const voter = game.players.find(x => x.id === voterPlayerId);
        if (!(voter && voted)) { throw new Error(`Player does not exist.`); }
        if(!(voter.isAlive && voted.isAlive)) {throw new Error(`Player is dead.`)}
        if (!(voter.role === seerRole)) {
            throw new Error(`Player is not a seer.`);
        }
        if(!(game.seerPeekedAliasIds.indexOf(voted.aliasId) === -1)) {
            throw new Error(`player has already been peeked on.`);
        }
        if(game.seerVote !== undefined) { throw new Error(`seer has already chosen.`); }

        // add seer vote
        return {
            ...game,
            seerPeekedAliasIds: [...game.seerPeekedAliasIds, voted.aliasId],
            seerVote: voted.aliasId
        };
    }
    // /** check skip seer phase if seer is dead.
    //  * @param {Game} game
    //  * @returns {Game} game
    //  */
    // #skipSeerVote = (game) => {
    //     if (game.phase.roundPhase !== NightPhaseEnum.SEERPEEK) { return game; }
    //     const seer = game.players.find(pl => pl.role === seerRole);
    //     if (seer && seer.isAlive) { return game; }

    //     return {
    //         ...game, phase: getNextGamePhase(game.phase)
    //     }
    // }

    /** process day / villager voting phase
     * * check if villager phase && vote is complete. else return game.
     * * tally votes
     * * if there is majority vote, kill player.
     * * mark if game complete
     * * change phase
     * @param {Game} game
     * @returns {Game}
     */
    #processDayPhase = (game) => {
        if (game.phase.dayOrNight !== dayOrNightEnum.DAY) { return game; }
        const alivePlayers = game.players.filter(x => x.isAlive);
        const votesComplete = alivePlayers.length === game.votes.length;
        if (!votesComplete) { return game; }
        const votedOut = tallyVote(game.votes);
        let newPlayers = game.players;
        if (votedOut !== undefined) {
            newPlayers = updateGamePlayerInList(
                pl => pl.aliasId === votedOut,
                pl => killPlayer('Killed by villagers.', pl),
                newPlayers
            );
        }
        return {
            ...game,
            votes: [],
            phase: getNextGamePhase(game.phase),
            players: newPlayers
        };
    }
    // /** process werewolf vote phase
    //  * @param {Game} game
    //  * @returns {Game} game
    //  */
    // #processWerewolfPhase = (game) => {
    //     if (game.phase.roundPhase !== NightPhaseEnum.WEREWOLVESHUNT) { return game; }
    //     if (game.werewolfVote === undefined) { return game; }
    //     return { ...game, phase: getNextGamePhase(game.phase) };
    // }
    /** process night phase
     * @param {Game} game
     * @returns {Game} game
     */
    #processNightPhase = (game) => {
        // night phase
        // all necessary vote is done
        if(game.phase.dayOrNight !== dayOrNightEnum.NIGHT) { return game; }
        const seer = game.players.find(x => x.role === seerRole);
        if(seer.isAlive && game.seerVote === undefined) {
            return game;
        }
        if(game.werewolfVote === undefined) {
            return game;
        }
        // if (!(game.phase.roundPhase === NightPhaseEnum.SEERPEEK
        //     && (game.seerVote !== undefined || !seer.isAlive))) { return game; }
        const players = updateGamePlayerInList(
            pl => pl.aliasId === game.werewolfVote,
            pl => killPlayer('Killed by werewolves.', pl),
            game.players
        )
        return {
            ...game,
            players,
            werewolfVote: undefined,
            seerVote: undefined,
            phase: getNextGamePhase(game.phase),
            round: game.round + 1
        }
    }
    /** check if game is over and update game if so.
     * @param {Game} game 
     * @returns {Game}
     */
    #finishGame = (game) => {
        const aliveWerewolves = game.players.filter(pl => pl.isAlive && pl.role === werewolfRole);
        const aliveVillagers = game.players.filter(pl =>
            pl.isAlive && (pl.role === seerRole || pl.role == villagerRole)
        );
        if (aliveWerewolves.length === 0) { return setWinnerVillager(game); }
        if (aliveVillagers.length <= aliveWerewolves.length) {
            return setWinnerWerewolves(game);
        }
        return game;
    }
    /** calls `startGame` with the current game players.
     */
    restartGame = async (playerId) => {
        const requestor = this.#gameState.players.find(pl => pl.id === playerId);
        if(!(requestor && requestor.isHost)) { throw new Error(`Only host can restart game.`); }
        const prevGamePlayers = this.#gameState.players;
        const players = this.#gameState.players.map(pl => ({
            playerId: pl.id,
            aliasId: pl.aliasId,
            isHost: pl.isHost
        }));
        await this.startGame(players);
        prevGamePlayers.forEach(pl => this.joinGame(pl.socketId, pl.id));
    }

    /** Get player's role
     * @param {string} playerId player's id
     * @param {Game} game 
     * @returns {werewolfRole | villagerRole | seerRole}
     */
    #getPlayerRole = (playerId, game) => {
        const player = game.players.find(pl => pl.id === playerId);
        if(!player) { throw new Error('Player not found!'); }
        return player.role;
    }
}