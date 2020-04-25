const { readFile } = require('../util');
const express = require('express');

const FILEPATH = './data/roles.json';
let roles = null;

async function initData() {
    if( ! roles ) {
        roles = await readFile(FILEPATH);
    }
}

function CreateRoleRoute(app) {
    const router = express.Router()

    router.get('/', async (req, res) => {
        await initData();

        res.status(200).send(roles);
    });

    router.get('/:name', async (req, res) => {
        await initData();

        const role = roles.filter(x =>
            x.name.toLowerCase() === req.params.name.toLowerCase()
        );
        if(!role) {
            res.status(404).send('Role not found');
        } else {
            res.status(200).send(role);
        }
    });

    return router;
}

module.exports = CreateRoleRoute;
