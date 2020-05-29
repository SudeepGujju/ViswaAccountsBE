const express       = require('express');
const path          = require('path');
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
const auth          = require('../middlewares/auth');

require('express-async-errors');

const basePath = "/api";

module.exports = function(app){

    app.use(express.static(path.join(__dirname, "../dist")));

    // app.use((req, res, next) => { console.log(req.method, req.url); next(); })

    app.use(basePath+"/"+"auth",   authRoutes);
    app.use(basePath+"/"+"user",    auth, userRoutes);
    // app.use(basePath+"/"+"user",    userRoutes);
    app.use(basePath+"/"+"group",   auth, groupRoutes);
    app.use(basePath+"/"+"product",   auth, productRoutes);
    app.use(basePath+"/"+"account", auth, accountRoutes);
    app.use(basePath+"/"+"reports", auth, reportRoutes);
    app.use(basePath+"/"+"bank",    auth, bankRoutes);
    app.use(basePath+"/"+"inventory", auth, inventoryRoutes);
    app.use(basePath+"/"+"general-voucher", auth, genVouchRoutes);
    app.use(basePath+"/"+"file",    auth, fileRoutes);

    app.get("/*", function (req, res, next) {
        return res.sendFile(
            path.join(__dirname, "../dist/index.html")
        );
    });

    app.use('**', function (req, res) {
        return res.status(404).send('Invalid request method/url');
    });

}