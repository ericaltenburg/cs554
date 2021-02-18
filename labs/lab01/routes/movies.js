const { request } = require('express');
const express = require('express');
const { movies } = require('../config/mongoCollections');
const router = express.Router();
const data = require('../data');
const moviesData = data.movies;
const lodash = require('lodash');

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
        res.status(500).json({error: e});
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

/**
 * PUT
 * updates all the fields, must all be supplied except comments
 */
router.put('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: "No id provided"});
        return;
    }

    let movieInfo = req.body;

    if (!movieInfo) {
        res.status(400).json({error: 'No data provided to update a movie'});
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
        await moviesData.get(req.params.id);
    } catch (e) {
        res.status(404).json({error: "No movie associated with the id"});
        return;
    }

    try {
        const movie = await moviesData.putUpdate(req.params.id, movieInfo);
        res.status(200).json(movie);
    } catch (e) {
        res.status(400).json({error: e});
    }
});

/**
 * PATCH
 * Updates fields but only those that were supplied. If no changes, then throws an error.
 */
router.patch('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({error: 'No id was given'})
    }

    const requestBody = req.body;
    let newMovieFields = {};

    try {
        const oldMovieFields = await moviesData.get(req.params.id);

        if (requestBody.title && requestBody.title !== oldMovieFields.title) {
            newMovieFields.title = requestBody.title;
        }

        if (requestBody.cast && !(lodash.isEqual(requestBody.cast, oldMovieFields.cast))) {
            newMovieFields.cast = requestBody.cast;
        }

        if (requestBody.info && !(lodash.isEqual(requestBody.info, oldMovieFields.info))) {
            newMovieFields.info = requestBody.info;
        }

        if (requestBody.plot && !(lodash.isEqual(requestBody.plot, oldMovieFields.plot))) {
            newMovieFields.plot = requestBody.plot;
        }

        if (requestBody.rating && requestBody.rating !== oldMovieFields.rating) {
            newMovieFields.rating = requestBody.rating;
        }
    } catch (e) {
        res.status(404).json({error: e});
        return;
    }

    if (Object.keys(newMovieFields).length !== 0) {
        try {
            const updatedMovie = await moviesData.patchUpdate(req.params.id, newMovieFields);
            res.status(200).json(updatedMovie);
        } catch (e) {
            res.status(400).json({error: e});
        }
    } else {
        res.status(400).json({error: "No fields have been changed from their initial values, so no patch has occurred"});
    }
});

router.post('/:id/comments', async (req, res) => {
    console.log(req.params.id);
    return;
});

module.exports = router;