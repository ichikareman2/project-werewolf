// @ts-check

/** @typedef {import('../game.service')} GameService */
module.exports = class gameIoService {
    /** @type {SocketIO.Server} */
    #io;
    /** @type {GameService} */
    #gameService;

    constructor (io, gameService) {
        this.#io = io;
        this.#gameService = gameService
    }
    onJoinGame = socket => 
        (playerId) => {
            this.#gameService.joinGame(socket.id, playerId);
        }
    
}