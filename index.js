const express = require('express');
const http = require('http');

// const {parseDate, formatDate} = require('./utils/format');
const app = express();

global.tokenSecret  = "TokenSecret";
global.authHeader   = "X-Auth-Token";
global.collections  = Object.freeze({ account: "accounts", bank: "banks", user: "users", group: "groups", product: "products"});
global.basePath     = __dirname;
global.uploadPath   = __dirname+"/uploads";
global.tempPath     = __dirname+"/temp";

// console.log(parseDate("27 / 04 / 2020"));
// console.log(formatDate(parseDate("27 / 04 / 2020")));

require('./startup/model-validation');
require('./startup/database')();
require('./startup/express-config')(app);
require('./startup/express-routes')(app);

const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
