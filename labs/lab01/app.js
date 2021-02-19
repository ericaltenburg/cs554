const express = require('express');
const app = express();
const configRoutes = require('./routes');

app.use(express.json());

let requests = 0;
app.use('*', (req, res, next) => {
    requests++;
    console.log("----------------------------------------");
    console.log(`Total Requests to the Server: ${requests}`);
    next();
});

app.use('*', (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`Request URL: ${fullUrl}`);
    console.log(`Request HTTP verb: ${req.method}`);
    console.log("Request Body: \n" ,req.body);
    next();
});

let urls = {};
app.use('*', (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (fullUrl in urls) {
        urls[fullUrl]++;
    } else {
        urls[fullUrl] = 1;
    }

    console.log("URL Requests:");
    console.log(urls);
    console.log("----------------------------------------\n");
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server :)");
    console.log("Your routes will be running on http://localhost:3000");
});