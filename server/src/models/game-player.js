// @ts-check
/** @typedef {import('./player').Player} Player */
/** @typedef {import('./player').PublicPlayer} PublicPlayer */
/** 
 * @typedef {Object} GamePlayerStatus
 * @property {boolean} alive
 * @property {string} causeOfDeath
 * @property {Role} role
 * @property {boolean} isHost
 * @property {string} socketId
 */
/**
 * @typedef {GamePlayerStatus & Player} GamePlayer
 */
const { shuffleArray } = require('../util');
/**
 * @enum string
 * @readonly
 */
const Role = {
    VILLAGER: 'Villager',
    WEREWOLF: 'Werewolf',
    SEER: 'Seer',
}

/** create a player for the game
 * @param {Player & {isHost: boolean}} player a player from lobby
 * @param {Role} role role of the player
 * @returns {GamePlayer}
 */
function createGamePlayer(player, role) {
    return {
        ...player,
        alive: true,
        causeOfDeath: '',
        role,
        isHost: player.isHost,
        socketId: undefined
    }
}
/** set a player's socketId
 * @param {string} socketId
 * @param {GamePlayer} gamePlayer
 * @returns {GamePlayer}
 */
function setGamePlayerSocketId(socketId, gamePlayer) {
    return {
        socketId,
        ...gamePlayer
    }
}
/** change alive status and state reason of death
 * @param {string} causeOfDeath cause of player's death
 * @param {GamePlayer} player player object to update
 * @returns {GamePlayer}
 */
function killPlayer(causeOfDeath, player) {
    return {
        ...player,
        alive: false,
        causeOfDeath
    }
}
/** create roles in random order following werewolf rules.
 * @param {number} count how many roles to make
 * @returns {Role[]}
 */
function createShuffledRoles(count) {
    const seer = Role.SEER;
    let werewolves;
    if (count > 15) { werewolves = Array(4).fill(Role.WEREWOLF) }
    else if (count > 11) { werewolves = Array(3).fill(Role.WEREWOLF) }
    else if (count > 8) { werewolves = Array(2).fill(Role.WEREWOLF) }
    else { werewolves = Array(1).fill(Role.WEREWOLF) }
    /** @type {Role[]} */
    let roles = [seer, ...werewolves];
    /** @type {Role[]} */
    const villagers = Array(count - roles.length).fill(Role.VILLAGER);
    return shuffleArray([...roles, ...villagers])
}
/** update a gamePlayer in a list
 * @param {(pl: GamePlayer) => boolean} matchFn 
 * @param {(pl: Readonly<GamePlayer>) => GamePlayer} updateFn 
 * @param {GamePlayer[]} playerList 
 */
function updateGamePlayerInList(matchFn, updateFn, playerList) {
    const plIndex = playerList.findIndex(matchFn);
    if (plIndex < 0) { return playerList }
    let newPlayerList = [...playerList]
    newPlayerList[plIndex] = updateFn(playerList[plIndex]);
    return newPlayerList;
}
module.exports = {
    Role,
    createGamePlayer,
    setGamePlayerSocketId,
    killPlayer,
    createShuffledRoles,
    updateGamePlayerInList
}
