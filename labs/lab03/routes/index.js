const showsRoutes = require('./shows');

const constructorMethod = (app) => {
    app.use("/", showsRoutes);
    app.use("*", (req, res) => {
        res.status(404).render('shows/error', {title: "Error", type3: true, code: "404"});
    });
};

module.exports = constructorMethod;