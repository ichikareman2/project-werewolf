// @ts-check

const fs = require('fs');
const path = require('path');
const util = require('util');

/** turn socket io with callback to a promise
 * @param emitFn socket.io emit fn 
 */
function promisifySocketEmit(emitFn) {
    return function (...args) {
        return new Promise((res,rej) => {
            emitFn(...args, (response) => {
                if(!response) { res() }
                if(response.error) { rej(response.error) }
                res(response.data);
            })
        })
    }
}
/** NO OPeration. stub for optional callbacks.
 * @param {any[]} _
 * @returns {any[]} */
function noop(..._) { return _; }

/** Shuffle array items.
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function shuffleArray(array) {
    return array.reduce((acc,curr,i) => {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = acc[j];
        acc[j] = acc[i];
        acc[i] = temp;
        return acc;
    }, array.slice());
}

async function readFile(filepath) {
    const completePath = path.join(__dirname, filepath);
    const readFileAsync = util.promisify(fs.readFile);
    const fileContents = await readFileAsync(completePath, 'utf8');

    return JSON.parse(fileContents || '');
}

/** map item in the list if condition is met
 * @template T
 * @param {(item: T) => boolean} matchFn if true, map
 * @param {(item: T) => T} mapFn modify T
 * @param {T[]} list list of T
 */
function conditionalMap(matchFn, mapFn, list) {
    return list.map(item => matchFn(item) ? mapFn(item) : item)
}
/** find item in the list and update
 * @template T
 * @param {(item: T) => boolean} matchFn if true, map
 * @param {(item: T) => T} mapFn modify T
 * @param {T[]} list list of T
 */
function findUpdate(matchFn, mapFn, list) {
    const clone = list.slice();
    const i = clone.findIndex(matchFn);
    clone[i] = mapFn(clone[i]);
    return clone;
}
/** if else in function
 * @template T
 * @template U
 * @param {[(value: T) => boolean, (value: T) => U][]} condTransList
 * @param {T} value
 * @returns {U}
 */
function cond(condTransList, value) {
    const match = condTransList.find(([matchFn]) => matchFn(value));
    return match ? match[1](value) : undefined;
}

module.exports = {
    promisifySocketEmit,
    noop,
    shuffleArray,
    readFile,
    conditionalMap,
    findUpdate,
    cond
}
