const fs = require('fs');
const path = require('path');

// @ts-check
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

function readFile(filepath) {
    const completePath = path.join(__dirname, filepath);
    const fileContents = fs.readFileSync(completePath);

    return JSON.parse(fileContents || '');
}

module.exports = {
    promisifySocketEmit,
    noop,
    readFile
}