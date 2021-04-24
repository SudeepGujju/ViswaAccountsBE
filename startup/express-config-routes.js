require('express-async-errors');
const express       = require('express');
const path          = require('path');

const errorHandler  = require('../middlewares/error');
// const auth          = require('../middlewares/auth');

const userRoutes    = require('../routes/user-route');
const reportRoutes  = require('../routes/report-route');
const groupRoutes   = require('../routes/group-route');
const accountRoutes   = require('../routes/account-route');
const authRoutes   = require('../routes/auth-route');
const bankRoutes   = require('../routes/bank-route');
const fileRoutes   = require('../routes/file-route');
const productRoutes = require('../routes/product-route');
const inventoryRoutes = require('../routes/inventory-route');
const genVouchRoutes = require('../routes/general-voucher-route');
const glRoutes      = require('../routes/gl-route');
const orderRoutes      = require('../routes/order-route');
const passport = require('passport');

const apiBasePath = "/api";

module.exports = function(app){

    app.use(express.static(path.join(__dirname, "../public")));

    app.use(apiBasePath+"/"+"auth",   authRoutes);
    app.use(apiBasePath+"/"+"users",    passport.authenticate('jwt', {session: false}), userRoutes);
    // app.use(basePath+"/"+"user",    userRoutes);
    app.use(apiBasePath+"/"+"groups",  passport.authenticate('jwt', {session: false}), groupRoutes);

    app.use(apiBasePath+"/"+"products",   passport.authenticate('jwt', {session: false}), productRoutes);
    app.use(apiBasePath+"/"+"accounts", passport.authenticate('jwt', {session: false}), accountRoutes);
    app.use(apiBasePath+"/"+"reports", passport.authenticate('jwt', {session: false}), reportRoutes);
    app.use(apiBasePath+"/"+"bank",    passport.authenticate('jwt', {session: false}), bankRoutes);
    app.use(apiBasePath+"/"+"inventories", passport.authenticate('jwt', {session: false}), inventoryRoutes);
    app.use(apiBasePath+"/"+"general-vouchers", passport.authenticate('jwt', {session: false}), genVouchRoutes);
    app.use(apiBasePath+"/"+"file",    passport.authenticate('jwt', {session: false}), fileRoutes);
    app.use(apiBasePath+"/"+"gl",    passport.authenticate('jwt', {session: false}), glRoutes);
    app.use(apiBasePath+"/"+"order",    passport.authenticate('jwt', {session: false}), orderRoutes);

    app.get("/*", function (req, res, next) {
        return res.sendFile(
            path.join(__dirname, "../public/index.html")
        );
    });

    app.use('**', function (req, res) {
        return res.status(404).send('Invalid request method/url');
    });

    app.use(errorHandler);
    
}