const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const ActiveUsersSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: new Schema({
            loginID: String,
            username: String,
            finYearStart: Date,
            finYearEnd: Date,
            _id: ObjectId,
        }),
        required: true
    },
    lastAccessed:{
        type: Date
    }
});

const ActiveUsersModel = mongoose.model(global.collections.activeUsers, ActiveUsersSchema);

module.exports.ActiveUsersModel = ActiveUsersModel;