const mongoose = require('mongoose');
const { logger } = require('./logging');

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: true,
    // autoReconnect: true,
    // reconnectTries: 5,
    // reconnectInterval: 1000,
    serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 30s
    bufferMaxEntries: 0,
    family: 4 //Ipv4 - 4,
};

//mongodb://youruser:yourpassword@localhost/yourdatabase

// const url = "mongodb://localhost:27017/";
// const dbURI = "mongodb://viswa:viswa.2626@localhost:27017/viswaaccounts?authSource=admin";
const dbURI = "mongodb://viswa:viswa.2626@localhost:27017/viswaaccounts?authSource=admin&replicaSet=mongo-viswaaccounts-replica";

module.exports = function(){

    //Establish connection to mongoDB. Below method returns promise. If any error occurs during connection error wil be thrown.
    mongoose.connect(dbURI, mongooseOptions).catch(function(e){
        logger.error('Unable to create mongoose connection ' + e);
    });

    const db = mongoose.connection;

    db.on('connected', function(){
        logger.info('Mongoose connected to ' + dbURI);
    });

    // db.on('error', function(err){
    //     logger.error('Mongoose connection error ' + err);
    // });

    db.on('disconnected', function(){
        logger.info('Mongoose disconnected');
    });

    process.on('SIGINT', function(){
        db.close(function(){
            logger.info('Mongoose connection closed through app termination');
            process.exit(0);
        });
    });
}