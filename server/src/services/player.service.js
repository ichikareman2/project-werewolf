// @ts-check

/** @typedef {(import('../models/player.js').Player)} Player */
/** @typedef {(import('../models/player.js').PublicPlayer)} PublicPlayer */

const fstorm = require('fstorm');
const fs = require('fs');
const { promisify } = require('util');
const { EventEmitter } = require('events');
const {
    getPlayerById,
    getPlayersByIds,
    updatePlayer,
    addPlayer
} = require('../models/player')

/** path of file to get and save players data */
const filePath = 'playersDb.json';


module.exports = class PlayerService extends EventEmitter {
    static playerUpdateEvent = 'playerUpdated';
    /** fstorm file writer instance */
    #fileWriter = fstorm(filePath);
    /** promised fileWriter */
    #promisedWrite = promisify(this.#fileWriter.write.bind(this.#fileWriter));
    /** in memory store for players
     * @type {Player[]}
     */
    #playersDb = [];

    constructor() {
        super();
        this.#restorePlayers();
    }

    /** restores data to `playersDb` from file in `filePath`
     */
    #restorePlayers = async () => {
        fs.access(filePath, fs.constants.F_OK, async (err) => {
            if(err) {
                this.#persistPlayers([])
            } else {
                const data = await promisify(fs.readFile)(filePath, 'utf8');
                this.#playersDb = JSON.parse(data);
            }
        })
    }
    /** Persist players whole data
     * @param {Player[]} players players array to save
     * @returns {Promise<any>}
     */
    #persistPlayers = async (players) => {
        const status = await this.#promisedWrite(JSON.stringify(players))
        console.log(`updated file.`, status);
    }
    /** savePlayers
     * @param {Player[]} players
     * @returns {Promise<boolean>}
     */
    #savePlayers = async (players) => {
        this.#playersDb = players;
        await this.#persistPlayers(players);
        return true;
    }
    /** Get all players
     * @returns {Promise<Player[]>}
     */
    getAllPlayers = () =>
        new Promise(res => res(this.#playersDb));

    /**
     * @param {Player} player
     * @returns
     */
    addPlayer = (player) =>
        new Promise((res) =>
            res(this.#savePlayers(addPlayer(player, this.#playersDb)))
        ).then(() => true);
    /**
     * @param {string} id
     * @param {Player} player
     * @returns {Promise<boolean>}
     */
    updatePlayer = (id, player) =>
        new Promise((res) => {
            res(this.#savePlayers(updatePlayer(
                pl => pl.id === id,
                () => player,
                this.#playersDb
            )));
        }).then(() => this.emit(PlayerService.playerUpdateEvent, player))
            .then(() => true);
    /** find player
     * @param {(pl:Player) => Player} matchFn matching function
     * @returns {Promise<Player>}
     */
    findPlayer = (matchFn) =>
        new Promise(res => res(this.#playersDb.find(matchFn)));
    /** get player by id
     * @param {string} id
     * @returns {Promise<Player>}
     */
    getPlayerById = id =>
        new Promise(res => res(getPlayerById(id, this.#playersDb)))
    /**
     * @param {string[]} ids
     * @returns {Promise<Player[]>}
     */
    getPlayersByIds = ids =>
        new Promise(res => res(getPlayersByIds(ids, this.#playersDb)))
}
