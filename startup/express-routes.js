const express       = require('express');
const path          = require('path');
const userRoutes    = require('../routes/user-route');
const reportRoutes  = require('../routes/report-route');
const groupRoutes   = require('../routes/group-route');
const accountRoutes   = require('../routes/account-route');
const loginRoutes   = require('../routes/login-route');
const bankRoutes   = require('../routes/bank-route');
const fileRoutes   = require('../routes/file-route');
const playRoutes   = require('../routes/play-ground');
const auth          = require('../middlewares/auth');

require('express-async-errors');

const basePath = "/api";

module.exports = function(app){

    app.use(express.static(path.join(__dirname, "../dist")));

    // app.use((req, res, next) => { console.log(req.method); next(); })

    app.use(basePath+"/"+"login",   loginRoutes);
    app.use(basePath+"/"+"user",    auth, userRoutes);
    // app.use(basePath+"/"+"user",    userRoutes);
    app.use(basePath+"/"+"group",   auth, groupRoutes);
    app.use(basePath+"/"+"account", auth, accountRoutes);
    app.use(basePath+"/"+"reports", auth, reportRoutes);
    app.use(basePath+"/"+"bank",    auth, bankRoutes);
    app.use(basePath+"/"+"file",    auth, fileRoutes);
    // app.use(basePath+"/"+"play",    playRoutes);

    app.get("/*", function (req, res, next) {
        return res.sendFile(
            path.join(__dirname, "../dist/index.html")
        );
    });

    app.use('**', function (req, res) {
        return res.status(404).send('Invalid request method/url');
    });

}