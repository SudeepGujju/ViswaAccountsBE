const express = require('express');
const cors = require('cors');
const errorHandler = require('../middlewares/error');

module.exports = function(app){

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
        optionsSuccessStatus: 204
        //origin: ["https://localhost:4200"]
    };

    app.use(cors(corsOptions));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use(errorHandler);
}