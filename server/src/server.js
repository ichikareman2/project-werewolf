//@ts-check

const { createServer } = require('http');
const express = require('express');
const socketIo = require('socket.io');
/** port number of app
 * @type {number} */
const PORT = 8000;

/**
 * create server
 */
module.exports = function createApp() {
    /** The Express Application */
    const app = express();
    /** The application server */
    const server = createServer(app);
    /** port the server application will listen to */
    const port = process.env.PORT || PORT;
    /** socket io */
    const io = socketIo(server);

    
    io.on('connect', () => console.log('connected'));
    
    app.get('/', (req, res) => res.send('Project werewolf'));
    
    server.listen(port, () => console.log(`Running server on port ${port}`));

    return app;
}
