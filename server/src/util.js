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
/** No Operation. stub for optional callbacks. */
function noop(..._) { }

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
    }, [...array])
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

module.exports = {
    promisifySocketEmit,
    noop,
    shuffleArray,
    readFile,
    conditionalMap
}
