const mongoose = require('mongoose');

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: true,
    // autoReconnect: true,
    // reconnectTries: 5,
    // reconnectInterval: 1000,
    bufferMaxEntries: 0,
    family: 4 //Ipv4 - 4,
};

//mongodb://youruser:yourpassword@localhost/yourdatabase

// const url = "mongodb://localhost:27017/";
const url = "mongodb://viswa:viswa.2626@localhost:27017/";

const db = "viswaaccounts";
const dbURI = url+db;

module.exports = async function(){

    try
    {
        mongoose.connection.on('connected', function(){
            console.log('Mongoose connected to ' + dbURI);
        });

        mongoose.connection.on('error', function(err){
            console.log('Mongoose connection error ' + err);
        });

        mongoose.connection.on('disconnected', function(){
            console.log('Mongoose disconnected');
        });

        process.on('SIGINT', function(){
            mongoose.connection.close(function(){
                console.log('Mongoose disconnected through app termination');
                process.exit(0);
            });
        });

        await mongoose.connect(dbURI, mongooseOptions);
    }
    catch(ex)
    {
        console.log(ex);
    }
}