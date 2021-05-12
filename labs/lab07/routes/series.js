const bluebird = require('bluebird');
const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
const md5 = require('blueimp-md5');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const seriesListSet = 'seriesListSet';
const seriesSet = 'seriesSet';

/**
 * Verifies the string input
 * @param {string} str 
 */
 function checkIsProperPage (str) {
    if (str === undefined || str === null) throw "Page was not supplied"; // I don't think this is possible but
    if (typeof str !== 'string') throw "Page was not parsed correctly";
    if (!str.replace(/\s/g, '').length) throw "Page was just whitespace";
    if (isNaN(parseInt(str)) || parseInt(str) < 0) throw "Invalid page";
}

router.get('/page/:page', async (req, res) => {
    if (!req.params.page) {
        res.status(400).json({error: 'No page was given'});
        return;
    }

    try {   
        const publickey = '427973cb31fe34eeffacd502334f8894';
        const privatekey = '2cc1e97508d63501b4c99ebce874c1f6366b2f23';
        const ts = new Date().getTime();
        const stringToHash = ts + privatekey + publickey;
        const hash = md5(stringToHash);
        const baseURL = 'https://gateway.marvel.com:443/v1/public/series';
        const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

        let pageNum = req.params.page;
        checkIsProperPage(req.params.page);
        pageNum = parseInt(pageNum);
        
        const isInCache = await client.hexistsAsync(seriesListSet, pageNum);
        if (isInCache) {
            let response = await client.hgetAsync(seriesListSet, pageNum);
            response = JSON.parse(response);

            res.status(200).json(response);
        } else {
            const { data } = await axios.get(`${URL}&offset=${pageNum*20}`);

            await client.hsetAsync(seriesListSet, pageNum, JSON.stringify(data.data.results));

            res.status(200).json(data.data.results);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error: e})
    }
});

router.get('/:id', async(req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: 'No page was given'});
        return;
    }

    try {
        let charId = req.params.id;
        checkIsProperPage(charId);
        charId = parseInt(charId);

        const publickey = '427973cb31fe34eeffacd502334f8894';
        const privatekey = '2cc1e97508d63501b4c99ebce874c1f6366b2f23';
        const ts = new Date().getTime();
        const stringToHash = ts + privatekey + publickey;
        const hash = md5(stringToHash);
        const baseURL = `https://gateway.marvel.com:443/v1/public/series/${charId}`;
        const URL = baseURL + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

        const isInCache = await client.hexistsAsync(seriesSet, charId);
        if (isInCache) {
            let response = await client.hgetAsync(seriesSet, charId);
            response = JSON.parse(response);

            res.status(200).json(response);
        } else {
            const { data } = await axios.get(URL);

            if (data.data.count === 0) throw "No more entries found";

            await client.hsetAsync(seriesSet, charId, JSON.stringify(data.data.results[0]));

            res.status(200).json(data.data.results[0]);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error: e})
    }
})

module.exports = router;