const { readFile } = require('../util');

const FILEPATH = './data/roles.json';
let roles = null;

function initData() {
    if( ! roles ) {
        roles = readFile(FILEPATH);
    }
}

function CreateRoleRoute(app) {
    app.get('/role', (req, res) => {
        initData();

        res.status(200).send(roles);
    });

    app.get('/role/:name', (req, res) => {
        initData();

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
