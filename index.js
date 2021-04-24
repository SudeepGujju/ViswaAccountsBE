const express = require("express");
const http = require("http");
// const https = require("https");
// const socket = require("socket.io");
// const fs = require("fs");

const app = express();

require("./startup/model-validation")();

require("./startup/express-config-app")(app);
const { logger } = require("./startup/logging");
require("./startup/express-config-routes")(app);
require("./startup/database")();
require("./startup/tasks")();
require("./startup/cleanup")();

const server = http.createServer(app);

server.listen(app.get('port'), () => {
  logger.info(`Http Server started on port ${app.get('port')}`);
});

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
/*
  sserver.listen(sport, () => {
    console.log(`Https Server started on port ${sport}`);
  });
*/