const cluster = require('cluster');
const { logger } = require("./startup/logging");

// Check the number of availiable CPU.
const numCPUs = require('os').cpus().length;

// For Master process
if (process.env == "production" && cluster.isMaster) {

  logger.info(`Master ${process.pid} is running`);
  
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // This event is firs when worker died
  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);

    logger.info('Starting a new worker');
    cluster.fork();
  });

}else{

  const express = require("express");
  const http = require("http");
  // const https = require("https");
  // const socket = require("socket.io");
  // const fs = require("fs");

  const app = express();

  require("./startup/model-validation")();

  require("./startup/express-config-app")(app);
  require("./startup/express-config-routes")(app);
  require("./startup/database")();
  // require("./startup/tasks")();
  require("./startup/cleanup")();

  const server = http.createServer(app);

  server.listen(app.get('port'), () => {

    logger.info(`Http Server started on port ${app.get('port')} and Worker ${process.pid} started`);

  });

}

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