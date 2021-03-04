const express = require('express');
const static = express.static(__dirname + '../public');
const app = express();
app.use('../public', static);

const constructorMethod = (app) => {
    app.use('/', (req, res) => {
        res.sendFile("index.html" , {root: __dirname + "/../public"});
    });
    app.use('*', (req, res) => {
        res.status(404).json({error: 'That route can not be found'});
    });
};

module.exports = constructorMethod;