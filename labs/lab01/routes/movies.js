const express = require('express');
const { movies } = require('../config/mongoCollections');
const router = express.Router();
const data = require('../data');
const moviesData = data.movies;

/**
 * Gets the movies with the options to skip n amount or take x amount up to 100. 
 * Default is 20.
 */
router.get('/', async (req, res) => {
    try {
        let skipAmt = req.query.skip;
        skipAmt = parseInt(skipAmt);
        let takeAmt = req.query.take;
        takeAmt = parseInt(takeAmt);

        

        const listOfMovies = await moviesData.getN(skipAmt, takeAmt);
        res.status(200).json(listOfMovies);
    } catch (e) {
        res.status(500).json({error: "hello"});
    }
});

/**
 * Gets the movie associated with a specific id.
 */
router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: 'No id was given'});
        return;
    }

    try {
        const movie = await moviesData.get(req.params.id);
        res.status(200).json(movie);
    } catch (e) {
        res.status(500).json({error: e});
    }
});

/**
 * Creates a movie with the given JSON and initializes the comments array as being empty initially.
 */
router.post('/', async (req, res) => {
    let movieInfo = req.body;

    if (!movieInfo) {
        res.status(400).json({error: 'No data provided to create a movie'});
        return;
    }
    if (!movieInfo.title) {
        res.status(400).json({error: 'No title provided'});
        return;
    }
    if (!movieInfo.cast) {
        res.status(400).json({error: 'No cast provided'});
        return;
    }
    if (!movieInfo.info) {
        res.status(400).json({error: 'No info provided'});
        return;
    }
    if (!movieInfo.plot) {
        res.status(400).json({error: 'No plot provided'});
        return;
    }
    if (!movieInfo.rating) {
        res.status(400).json({error: 'No rating provided'});
        return;
    }

    try {
        const createdMovie = await moviesData.create(movieInfo.title, movieInfo.cast, movieInfo.info, movieInfo.plot, movieInfo.rating);
        res.status(200).json(createdMovie);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

module.exports = router;