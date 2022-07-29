//projet d'identification
// Imports
const express     = require('express');
const bodyParser  = require('body-parser');
const usersCtrl = require('./userCtrl.js');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

// Instantiate server
let server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Configure routes
server.get('/', (_req , res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('Bienvenues sur mon server');
});

  // Users routes
server.post('/users/register/',(_req , res) => {
    usersCtrl.register(_req, res);
});

server.post('/users/login/',(_req , res) => {
    console.log(_req.body.username, _req.body.password,_req.body.email);
    usersCtrl.login(_req, res);
}); 

// Launch server
server.listen(port, function() {
    console.log('Server en écoute sur le port:' + port);
});