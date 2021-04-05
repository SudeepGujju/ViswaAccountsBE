const path          = require('path');
const express       = require('express');
const cors          = require('cors');
const compression   = require('compression');
const helmet        = require('helmet');

module.exports = function(app){

    global.tokenSecret = "TokenSecret";
    global.authHeader = "X-Auth-Token";
    global.collections = Object.freeze({
        account: "accounts",
        bank: "banks",
        user: "users",
        group: "groups",
        product: "products",
        inventory: "inventories",
        generalVoucher: "general-vouchers",
        gl: "gls",
        order: "orders",
        trailBalance: "trail-balances"
    });

    global.appBasePath = path.join(__dirname, "..");
    global.uploadPath = path.join(global.appBasePath, "uploads");
    global.tempPath = path.join(global.appBasePath, "temp");
    global.logFolderName = "logs";
    global.appStartTime = new Date();
    global.userTokens = {};

    app.set("port", (process.env.PORT || 8000) );
    app.set('env',  (process.env.NODE_ENV || 'development') );

    /*
    By default, however, Express publicizes itself. In every request, there’s an HTTP
    header that identifies your site as powered by Express. X-Powered-By: Express is sent
    with every request, by default. You can easily disable it with a setting:
    app.disable("X-Powered-By");
    Disabling the X-Powered-By option disables the setting of the header. Disabling this
    will make it a little harder for hackers.
    */
    //app.disable('x-powered-by');

    app.use(helmet());
    // app.use(helmet({contentSecurityPolicy: false}));

    app.use(compression());

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
}