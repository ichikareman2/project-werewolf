const { readFile } = require('../util');

const FILEPATH = './data/roles.json';
let roles = null;

async function initData() {
    if( ! roles ) {
        roles = await readFile(FILEPATH);
    }
}

function CreateRoleRoute(app) {
    app.get('/role', async (req, res) => {
        await initData();

        res.status(200).send(roles);
    });

    app.get('/role/:name', async (req, res) => {
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
}

module.exports = CreateRoleRoute;
