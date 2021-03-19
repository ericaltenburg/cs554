const bluebird = require('bluebird');
const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const searchTermsPage = "searchTermsPage";

/**
 * Verifies the string input
 * @param {string} str 
 */
 function checkIsProperString (str) {
    if (str === undefined || str === null) throw "ID was not supplied"; // I don't think this is possible but
    if (typeof str !== 'string') throw "ID was not parsed correctly";
    if (!str.replace(/\s/g, '').length) throw "ID was just whitespace";

    let num = Number(str);
    if (!Number.isInteger(num) || num < 1) throw "ID must be a positive integer";
}

/**
 * Verifies the string input
 * @param {string} str 
 */
 function checkIsProperStringSearch (str) {
    if (str === undefined || str === null) throw "ID was not supplied"; // I don't think this is possible but
    if (typeof str !== 'string') throw "ID was not parsed correctly";
    if (!str.replace(/\s/g, '').length) throw "ID was just whitespace";
}

/**
 * Grabs the shows by an specific id
 * @param {string} id 
 */
 async function getShowById(id) {
    checkIsProperString(id);
    let site = 'http://api.tvmaze.com/shows/' + id;
    const { data } = await axios.get(site);
    return data;
}

/**
 * Grabs the shows by an specific term
 * @param {string} term 
 */
 async function getShowBySearchTerm(term) {
    checkIsProperStringSearch(term);
    let site = 'http://api.tvmaze.com/search/shows?q=' + term;
    const { data } = await axios.get(site);
    return data;
}

/**
 * Grabs list of all shows
 * @returns list of shows
 */
async function getAllShows () {
    let site = 'http://api.tvmaze.com/shows';
    let { data } = await axios.get(site);  
    return data;
}

/**
 * GET on the home page returns all shows and then stores in cache
 */
router.get('/', async (req, res) => {
    try {
        const HomePageExists = await client.existsAsync("homePage");
        if (!HomePageExists) {
            const shows = await getAllShows();

            res.render('shows/allShows', {title: "TV Maze Shows", shows: shows}, async (err, html) => {
                let cacheForAllShows = await client.setAsync(
                    "homePage", 
                    html
                );

                res.send(html);
            });
        } else {
            let html = await client.getAsync("homePage");

            res.send(html);
        }
    } catch (e) {
        res.status(404).render('shows/error', {title: "TV Maze Shows", code: "404", type4: true, text: e});
    }
});

/**
 * GET route for shows/:id where id is the id for a given show
 */
router.get('/show/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(404).render('shows/error', {title: "TV Maze Shows", code: "404", type2: true});
            return;
        }

        showID = req.params.id.trim().trimStart();

        let showPageExists = await client.existsAsync(showID);
        if (!showPageExists) {
            const show = await getShowById(showID);
            
            let img_src = !show.image ? "/public/no_image.jpeg" : show.image.medium;
            show.name = !show.name ? "N/A" : show.name;
            show.language = !show.language ? "N/A" : show.language;
            let temp_genre = show.genres.length === 0 ? show.genres.push("N/A") : show.genres;
            show.rating.average = !show.rating.average ? "N/A" : show.rating.average;
            if (!show.network) {
                show.network = {name : "N/A"};
            }
            show.summary = !show.summary ? "N/A" : show.summary;

            res.render('shows/indivShow', {title: "TV Maze Shows", show: show, img_src}, async (err, html) => {
                let cacheForIndivShow = await client.setAsync(
                    showID,
                    html
                );

                res.send(html);
            });
        } else {
            let html = await client.getAsync(showID);

            res.send(html);
        }
    } catch (e) {
        res.status(404).render('shows/error', {title: "TV Maze Shows", code: "404", type4: true, text: e});
    }    
});

/**
 * POST route for search terms
 */
router.post('/search', async (req, res) => {
    let searchData = req.body;
    let errors = [];

    if (!searchData.searchTerm || searchData.searchTerm.trimStart().trim().length === 0) {
        errors.push("No search term provided");
    }

    if (errors.length > 0) {
        res.render('shows/searchError', {title: "TV Maze Shows", term: searchData.searchTerm, errors: errors});
        return;
    }

    let term = searchData.searchTerm.trimStart().trim();

    try {
        const searchScore = await client.zincrbyAsync("searchSet", 1, term);

        let searchPageExists = await client.existsAsync(term);
        if (!searchPageExists) {
            const shows = await getShowBySearchTerm(term);

            res.render('shows/searchShows', {title: "TV Maze Shows", shows: shows, search_term: term}, async (err, html) => {
                let cacheForSearchTerm = await client.setAsync(
                    term, 
                    html
                );

                res.send(html);
            });
        } else {
            let html = await client.getAsync(term);
            res.send(html);
        }
    } catch (e) {
        res.status(404).render('shows/error', {title: "TV Maze Shows", code: "404", type4: true, text: e});
    }
});

/**
 * GET for popularsearches, displays the top most searched terms
 */
router.get('/popularsearches', async (req, res) => {
    try {
        let term = await client.zrevrangebyscoreAsync("searchSet", "+inf", "-inf");

        term = term.slice(0, 10);

        res.render('shows/searchTerms', {title: "TV Maze Shows", search_term: term});
    } catch (e) {
        res.status(404).render('shows/error', {title: "TV Maze Shows", code: "404", type4: true, text: e}); 
    }
});

module.exports = router;