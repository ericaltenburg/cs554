const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
let { ObjectId } = require('mongodb');
const { update } = require('../../lab06/data/books');

/**
 * Verifies the number input
 * @param {number} num 
 */
function checkIsProperNumber (num) {
	if (typeof num !== 'number') throw `Error: ${num} is NaN`;
	if (num < 0) throw `Error: ${num} is not a positive number`;
}

/**
 * Verifies the string input
 * @param {string} str 
 */
function checkIsProperString (str) {
    if (str === undefined || str === null) throw "Error: string does not exist";
    if (typeof str !== 'string') throw `Error: ${str} is not of type string`;
    if (str.trim().length === 0) throw `String just whitespace`;
}

/**
 * Checks to make sure the object is valid and has the first and last name
 * @param {Object} obj 
 */
function checkIsRightMember (obj) {
    if (isEmpty(obj)) throw "Error: object is empty";
    if (!("firstName" in obj)) throw `Error: object is missing cast member's first name`;
    checkIsProperString(obj['firstName']);
    if (!("lastName" in obj)) throw `Error: object is missing cast member's last name`;
    checkIsProperString(obj['lastName']);
}

/**
 * Verifies the array input, and has at least one element that is valid string, also
 * checks for duplicates
 * @param {Array} arr 
 */
function checkIsProperCast (arr) {
	if (arr === undefined || arr === null) throw `Error: array does not exist`;
	if (!Array.isArray(arr)) throw `Error: argument is not an array`;
    if (arr.length === 0) throw `Error: array is empty`;

    let seen = [];

    arr.forEach( (value) => {
        if (typeof value !== 'object' || value === null) {
            throw 'Error: invalid item in array';
        } else {
            checkIsRightMember(value);
        }

        // Check for duplicates
        seen.forEach( (seenVal) => {
            if (seenVal.firstName === value.firstName && seenVal.lastName === value.lastName) {
                throw `Error: duplicates found`;
            }
        });

        seen.push(value);
    });
}

/**
 * Checks to see if object is empty
 * @param {object} obj 
 */
function isEmpty (obj) {
    if (obj === undefined || obj === null) throw `Error: object does not exist`;
    if (typeof obj !== 'object' || obj === null) throw `Error: ${obj} is not an object`;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks to make sure the object is valid and has the first and last name
 * @param {Object} obj 
 */
function checkIsProperInfo (obj) {
    if (typeof obj !== 'object' || obj === null) throw 'Error: not an object';
    if (isEmpty(obj)) throw "Error: object is empty";
    if (!("director" in obj)) throw `Error: object is missing director's first name`;
    checkIsProperString(obj['director']);
    if (!("yearReleased" in obj)) throw `Error: object is missing the year released`;
    checkIsProperNumber(obj['yearReleased']);
}

/**
 * Gets the amount of movies needed for the call. Defualt is 20, max of 100.
 * @param {number} skipAmt 
 * @param {number} takeAmt 
 */
async function getN (skipAmt, takeAmt) {
    if (isNaN(skipAmt)) throw `Error: skip is NaN`;
    if (!skipAmt) {
        skipAmt = 0;
    }
    checkIsProperNumber(skipAmt);
    
    if (isNaN(takeAmt)) throw `Error: take is NaN`;
    if (!takeAmt) {
        takeAmt = 20;
    }
    checkIsProperNumber(takeAmt);
    
    
    const moviesCollection = await movies();
    const moviesListAll = await moviesCollection.find({}).skip(skipAmt).limit(takeAmt).toArray();

    moviesListAll.forEach( (value) => {
        value['_id'] = "" + value['_id'];
    });

    return moviesListAll;
}

/**
 * Gets the movie title with a specific id
 * @param {string} id 
 */
async function get (id) {
    checkIsProperString(id);
    id = id.trimStart();
    id = ObjectId(id).valueOf();

    const moviesCollection = await movies();

    const theMovie = await moviesCollection.findOne({_id: id});
    if (!theMovie) throw `Error: no movie found with that id`;

    theMovie['_id'] = "" + theMovie['_id'];

    return theMovie;
}

/**
 * Creates a new movie
 * @param {string} title 
 * @param {array} cast 
 * @param {object} info 
 * @param {string} plot 
 * @param {number} rating 
 */
async function create (title, cast, info, plot, rating) {
    checkIsProperString(title);
    title = title.trimStart();
    checkIsProperCast(cast);
    checkIsProperInfo(info);
    checkIsProperString(plot);
    plot = plot.trimStart();
    checkIsProperNumber(rating);

    const moviesCollection = await movies();

    const newMovie = {
        title,
        cast,
        info,
        plot,
        rating,
        'comments': []
    };

    const insertedInfo = await moviesCollection.insertOne(newMovie);
    if (insertedInfo.insertCount === 0) throw `Error: could not add the movie`;

    const newId = insertedInfo.insertedId + "";
    const aMovie = await this.get(newId);

    return aMovie;
}

/**
 * PUT
 * Updates movie with the respective information, comments do not change, they are carried over.
 * @param {string} id 
 * @param {object} obj 
 */
async function putUpdate (id, obj) {
    checkIsProperString(id);
    id = id.trimStart();
    isEmpty(obj);
    checkIsProperString(obj.title);
    let title = obj.title.trimStart();
    checkIsProperCast(obj.cast);
    let cast = obj.cast;
    checkIsProperInfo(obj.info);
    let info = obj.info;
    checkIsProperString(obj.plot);
    let plot = obj.plot.trimStart();
    checkIsProperNumber(obj.rating);
    let rating = obj.rating;

    const moviesCollection = await movies();


    let updatedMovie = {
        title,
        cast,
        info,
        plot,
        rating
    };

    id = ObjectId(id).valueOf();

    const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: updatedMovie});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Error: Update failed`;

    id = "" + id;

    return await this.get(id);
}

/**
 * PATCH
 * Updates the movie with the respective information, comments do not change, only sets values
 * if there is a change from previous values.
 * @param {string} id 
 * @param {object} obj 
 */
async function patchUpdate (id, obj) {
    checkIsProperString(id);
    id = id.trimStart();

    isEmpty(obj);

    const moviesCollection = await movies();

    if (obj.title) {
        checkIsProperString(obj.title);
        obj.title = obj.title.trimStart();
    }

    if (obj.cast) {
        checkIsProperCast(obj.cast);
    }

    if (obj.info) {
        checkIsProperInfo(obj.info);
    }

    if (obj.plot) {
        checkIsProperString(obj.plot);
        obj.plot = obj.plot.trimStart();
    }

    if (obj.rating) {
        checkIsProperNumber(obj.rating);
    }

    id = ObjectId(id).valueOf();
    const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: obj});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Error: Update failed`;

    id = "" + id;

    return await this.get(id);
}

/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {string} comment 
 */
async function createComment (id, name, comment) {
    checkIsProperString(id);
    id = id.trimStart();
    checkIsProperString(name);
    name = name.trimStart();
    checkIsProperString(comment);
    comment = comment.trimStart();

    const moviesCollection = await movies();
    const movie = await get(id);

    const newComment = {
        "_id": ObjectId(),
        name,
        comment
    };

    let comments = movie.comments;
    comments.push(newComment);
    let commentObj = {comments};

    id = ObjectId(id).valueOf();

    const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: commentObj});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Error: Update failed`;

    id = "" + id;

    return await this.get(id);
}

/**
 * Removes the comment by commentId associated with the movieId.
 * @param {string} movieId 
 * @param {string} commendId 
 */
async function removeComment (movieId, commentId) {
    checkIsProperString(movieId);
    movieId = movieId.trimStart();
    checkIsProperString(commentId);
    commentId = commentId.trimStart();

    const moviesCollection = await movies();
    
    const movie = await get(movieId);

    let comments = movie.comments;

    let index = -1;
    comments.forEach ( (value, indx) => {
        value._id = "" + value._id;
        if (value._id === commentId) {
            index = indx;
        }
    });

    if (index > -1) {
        comments.splice(index, 1);
    } else {
        throw `Error: The comment with an associated comment id was not found`
    }

    let updatedComments = {comments};

    movieId = ObjectId(movieId).valueOf();
    const updateInfo = await moviesCollection.updateOne({_id: movieId}, {$set: updatedComments});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Error: Update failed`;

    movieId = "" + movieId;

    return await this.get(movieId);
}

module.exports = {
    getN,
    get,    
    create,
    putUpdate,
    patchUpdate,
    createComment,
    removeComment
}