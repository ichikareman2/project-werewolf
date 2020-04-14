//@ts-check
/** @typedef {(import('./models/player.js').Player)} Player */
/** @typedef {(import('./models/player.js').PublicPlayer)} PublicPlayer */

/** @typedef {(import('./models/lobby.js').Lobby)} Lobby */
const { createServer } = require('http');
const express = require('express');
const socketIo = require('socket.io');
const PlayerService = require('./services/player.service');
const PlayerIoService = require('./services/io/player-io.service')
const LobbyService = require('./services/lobby.service');
const LobbyIoService = require('./services/io/lobby-io.service')
const {
    createNewPlayer,
    updatePlayerName,
    getPublicPlayer
} = require('./models/player')
const { createFailedResponse, createSuccessResponse } = require('./models/response')
const { noop } = require('./util')
/** port number of app
 * @type {number} */
const PORT = 8000;

/**
 * create server
 */
function createApp() {
    /** The Express Application */
    const app = express();
    /** The application server */
    const server = createServer(app);
    /** port the server application will listen to */
    const port = process.env.PORT || PORT;
    /** socket io */
    const io = socketIo(server);

    server.listen(port, () => console.log(`Running server on port ${port}`));
    
    /** Entity Services */
    const playerService = new PlayerService();
    const lobbyService = new LobbyService()

    /** IO Services */
    const lobbyIoService = new LobbyIoService(io, lobbyService, playerService);
    const playerIoService = new PlayerIoService(io, playerService);
    
    return app;
}

module.exports = {
    PORT,
    createApp
}