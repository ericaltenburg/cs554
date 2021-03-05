const express = require('express');
const static = express.static(__dirname + '../public');
const app = express();
app.use('../public', static);

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        res.sendFile("index.html", {root: __dirname + "/../public/html/"});
    });
    app.use('*', (req, res) => {
        res.status(404).sendFile("error.html", {root: __dirname + "/../public/html"});
    });
};

module.exports = constructorMethod;