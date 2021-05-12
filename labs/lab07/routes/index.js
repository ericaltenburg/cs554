const charactersRoutes = require('./characters');
const seriesRoutes = require('./series');
const comicsRoutes = require('./comics');

const constructorMethod = (app) => {
    app.use("/characters/", charactersRoutes);
    app.use("/series/", seriesRoutes);
    app.use("/comics/", comicsRoutes);
    app.use("*", (req, res) => {
        res.status(404).json({error: 'Not Found'});
    });
};

module.exports = constructorMethod;