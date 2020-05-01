// @ts-check

/** @typedef {import('../services/player.service')} PlayerService */
/** @typedef {import('../models/player').Player} Player */

const { createNewPlayer, updatePlayerName } = require('../models/player');
const express = require('express');

/** Initialize Player Socket IO service
 * @param {PlayerService} playerService 
 */
function CreatePlayerRoute(playerService) {
    const router = express.Router()

    router.post('/', async (req, res, next) => {
        try {
            const newPlayer = createNewPlayer(req.body.name);
            await playerService.addPlayer(newPlayer);
            res.status(201).send(newPlayer)
        } catch (error) {
            console.error(error);
            res.status(500).send(error)
        }
    });
    router.get('/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const player = await playerService.getPlayerById(id);
            res.status(200).send(player);
        } catch (err) {
            console.error(err);
            res.status(500).send(err)
        }
    });
    router.put('/', async (req, res, next) => {
        try {
            const id = req.body.id;
            const newName = req.body.name;
            const player = await playerService.getPlayerById(id);
            const newPlayer = playerService.updatePlayer(
                id,
                updatePlayerName(newName, player)
            );
            res.status(200).send(newPlayer);
        } catch (err) {
            console.error(err);
            res.status(500).send(err)
        }
    })
    return router;
}

module.exports = CreatePlayerRoute;
