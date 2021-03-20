require('express-async-errors');
const express       = require('express');
const path          = require('path');
const cors          = require('cors');
const compression   = require('compression');
const helmet        = require('helmet');

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

const basePath = "/api";

module.exports = function(app){

    /*
    By default, however, Express publicizes itself. In every request, there’s an HTTP
    header that identifies your site as powered by Express. X-Powered-By: Express is sent
    with every request, by default. You can easily disable it with a setting:
    app.disable("X-Powered-By");
    Disabling the X-Powered-By option disables the setting of the header. Disabling this
    will make it a little harder for hackers.
    */
    //app.disable('x-powered-by');

    //app.use(helmet());
    app.use(helmet({contentSecurityPolicy: false}));

    app.use(compression());

    app.use(express.static(path.join(__dirname, "../dist")));

    /*
    ** origin: Access-Control-Allow-Origin
    ** methods: Access-Control-Allow-Methods
    ** allowedHeaders: Access-Control-Allow-Headers - default Access-Control-Request-Headers
    ** exposedHeaders: Access-Control-Expose-Headers
    ** credentials: Access-Control-Allow-Credentials - to transfer cookies
    ** maxAge: Access-Control-Max-Age
    ** preflightContinue:
    ** optionsSuccessStatus: For successful OPTIONS requests choke on 204 status code
    */
    const corsOptions = {
        methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
        exposedHeaders: [global.authHeader],
        optionsSuccessStatus: 200
        //origin: ["https://localhost:4200"]
    };

    app.use(cors(corsOptions));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use(basePath+"/"+"auth",   authRoutes);
    app.use(basePath+"/"+"users",    auth, userRoutes);
    // app.use(basePath+"/"+"user",    userRoutes);
    app.use(basePath+"/"+"groups",   auth, groupRoutes);
    app.use(basePath+"/"+"products",   auth, productRoutes);
    app.use(basePath+"/"+"accounts", auth, accountRoutes);
    app.use(basePath+"/"+"reports", auth, reportRoutes);
    app.use(basePath+"/"+"bank",    auth, bankRoutes);
    app.use(basePath+"/"+"inventories", auth, inventoryRoutes);
    app.use(basePath+"/"+"general-vouchers", auth, genVouchRoutes);
    app.use(basePath+"/"+"file",    auth, fileRoutes);
    app.use(basePath+"/"+"gl",    auth, glRoutes);
    app.use(basePath+"/"+"order",    auth, orderRoutes);

    app.get("/*", function (req, res, next) {
        return res.sendFile(
            path.join(__dirname, "../dist/index.html")
        );
    });

    app.use('**', function (req, res) {
        return res.status(404).send('Invalid request method/url');
    });

    app.use(errorHandler);
    
}