const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  exitOnError: true,
  transports: [
    new winston.transports.DailyRotateFile({
      //@ts-ignore
      dirname: global.logFolderName,
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      frequency: '24h',
      maxSize: '2*1024*1024', //2MB Max FileSize
      format: winston.format.combine(
        winston.format.label(),
        winston.format.json(),
        winston.format.timestamp()
      ),
      handleExceptions: true,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports.default = function () {
  //Terminate the app if any uncaught exception occurred. Reason to terminate - as process can be in uncleaned state.
  process.on('uncaughtException', function (ex) {
    console.log(ex);
    //process.exit(1);
  });

  //Terminate the app if any unhandled promise rejection occurred. Reason to terminate - as process can be in uncleaned state.
  process.on('unhandledRejection', function (ex) {
    console.log(ex);
    //process.exit(1);
  });
};

module.exports.logger = logger;
