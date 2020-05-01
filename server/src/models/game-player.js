// @ts-check
/** @typedef {import('./player').Player} Player */
/** @typedef {import('./player').PublicPlayer} PublicPlayer */

/** villager role constant 
 * @constant
 * @default
 * @type {'Villager'}
*/
const villagerRole = 'Villager';
/** werewolf role constant 
 * @constant
 * @default
 * @type {'Werewolf'}
*/
const werewolfRole = 'Werewolf';
/** seer role constant 
 * @constant
 * @default
 * @type {'Seer'}
*/
const seerRole = 'Seer';

/** Roles available
 * @typedef {villagerRole | werewolfRole | seerRole} Role
 * @readonly
 */
/** player properties related to game
 * @typedef {Object} GamePlayerStatus
 * @property {boolean} isAlive
 * @property {string} causeOfDeath
 * @property {Role} role
 * @property {boolean} isHost
 * @property {string} socketId
 */
/** player model
 * @typedef {GamePlayerStatus & Player} GamePlayer
 */
/** player model with sensitive properties omitted
 * @typedef {Omit<GamePlayer, 'id' | 'socketId'> & {isConnected: boolean}} PublicGamePlayer */

const { shuffleArray } = require('../util');


/** create a player for the game
 * @param {Player & {isHost: boolean}} player a player from lobby
 * @param {Role} role role of the player
 * @returns {GamePlayer}
 */
function createGamePlayer(player, role) {
    return {
        ...player,
        isAlive: true,
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
        ...gamePlayer,
        socketId
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
        isAlive: false,
        causeOfDeath
    }
}
/** create roles in random order following werewolf rules.
 * @param {number} count how many roles to make
 * @returns {Role[]}
 */
function createShuffledRoles(count) {
    const seer = seerRole;
    let werewolves;
    if (count > 15) { werewolves = Array(4).fill(werewolfRole) }
    else if (count > 11) { werewolves = Array(3).fill(werewolfRole) }
    else if (count > 8) { werewolves = Array(2).fill(werewolfRole) }
    else { werewolves = Array(1).fill(werewolfRole) }
    /** @type {Role[]} */
    let roles = [seer, ...werewolves];
    /** @type {Role[]} */
    const villagers = Array(count - roles.length).fill(villagerRole);
    return shuffleArray(shuffleArray([...roles, ...villagers]));
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
/** get desensitized game player
 * @param {GamePlayer} player 
 * @returns {PublicGamePlayer}
 */
function getPublicGamePlayer(player) {
    const {id, socketId, ...rest} = player;
    return {...rest, isConnected: socketId !== undefined};
}
/** check if player is werewolf
 * @param {GamePlayer} gamePlayer player to check
 * @returns {boolean} */
function isWereWolf(gamePlayer) { return gamePlayer.role === werewolfRole }
/** check if player is Seer
 * @param {GamePlayer} gamePlayer player to check
 * @returns {boolean} */
function isSeer(gamePlayer) { return gamePlayer.role === seerRole }
/** check if player is Villager
 * @param {GamePlayer} gamePlayer player to check
 * @returns {boolean} */
function isVillager(gamePlayer) { return gamePlayer.role === villagerRole }

module.exports = {
    villagerRole,
    werewolfRole,
    seerRole,
    createGamePlayer,
    setGamePlayerSocketId,
    killPlayer,
    createShuffledRoles,
    updateGamePlayerInList,
    getPublicGamePlayer,
    isWereWolf,
    isSeer,
    isVillager
}
