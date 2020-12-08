const express = require("express");
const http = require("http");
const https = require("https");
const socket = require("socket.io");
const fs = require("fs");

const app = express();

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
global.basePath = __dirname;
global.uploadPath = __dirname + "/uploads";
global.tempPath = __dirname + "/temp";
global.appStartTime = new Date();
global.userTokens = {};

const { logger } = require("./startup/logging");
require("./startup/model-validation")();
require("./startup/express-config-routes")(app);
require("./startup/database")();

  const port = process.env.PORT || 8000;
  // const sport = process.env.SPORT || 8003;

  const server = http.createServer(app);
/*
  const sserver = https.createServer({
    key: fs.readFileSync("certificates/server.key"),
    cert: fs.readFileSync("certificates/server.crt")
  }, app);
*/
/*
  const io = socket(server);

  io.on("connection", (socket) => {
    socket.emit("message", "Socket Connected")
  })
*/
  server.listen(port, () => {
    logger.info(`Http Server started on port ${port}`);
  });
/*
  sserver.listen(sport, () => {
    console.log(`Https Server started on port ${sport}`);
  });
*/