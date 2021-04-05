require('express-async-errors');
const express       = require('express');
const path          = require('path');

const errorHandler  = require('../middlewares/error');
const auth          = require('../middlewares/auth');

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

const apiBasePath = "/api";

module.exports = function(app){

    app.use(express.static(path.join(__dirname, "../public")));

    app.use(apiBasePath+"/"+"auth",   authRoutes);
    app.use(apiBasePath+"/"+"users",    auth, userRoutes);
    // app.use(basePath+"/"+"user",    userRoutes);
    app.use(apiBasePath+"/"+"groups",   auth, groupRoutes);
    app.use(apiBasePath+"/"+"products",   auth, productRoutes);
    app.use(apiBasePath+"/"+"accounts", auth, accountRoutes);
    app.use(apiBasePath+"/"+"reports", auth, reportRoutes);
    app.use(apiBasePath+"/"+"bank",    auth, bankRoutes);
    app.use(apiBasePath+"/"+"inventories", auth, inventoryRoutes);
    app.use(apiBasePath+"/"+"general-vouchers", auth, genVouchRoutes);
    app.use(apiBasePath+"/"+"file",    auth, fileRoutes);
    app.use(apiBasePath+"/"+"gl",    auth, glRoutes);
    app.use(apiBasePath+"/"+"order",    auth, orderRoutes);

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