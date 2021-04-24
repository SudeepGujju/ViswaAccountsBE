const mongoose = require('mongoose');
const { logger } = require('./logging');

module.exports = function () {
  const db = mongoose.connection;

  process.on('SIGINT', function () {
    // @ts-ignore
    for (const taskName in global.tasks) {
      // @ts-ignore
      global.tasks[taskName].cancel(); //Clearing all tasks before exiting
    }

    db.close(function () {
      logger.info('Mongoose connection closed through app termination');
      process.exit(0);
    });
  });
};
