const moviesRoutes = require('./movies');

const constructorMethod = (app) => {
    app.use('/api/movies', moviesRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({error: 'That route can not be found'});
    });
};

module.exports = constructorMethod;