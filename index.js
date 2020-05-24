const express = require("express");
const http = require("http");

const app = express();

(async function () {

  global.tokenSecret = "TokenSecret";
  global.authHeader = "X-Auth-Token";
  global.collections = Object.freeze({
    account: "accounts",
    bank: "banks",
    user: "users",
    group: "groups",
    product: "products",
    inventory: "inventories",
  });
  global.basePath = __dirname;
  global.uploadPath = __dirname + "/uploads";
  global.tempPath = __dirname + "/temp";
  global.appStartTime = new Date();
  global.userTokens = {};

  try {
    require("./startup/model-validation");
    await require("./startup/database")();
    require("./startup/express-config")(app);
    require("./startup/express-routes")(app);

    const port = process.env.PORT || 8000;

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (e) {
    console.log("Unable to start application");
    console.log(e);
  }
})();
