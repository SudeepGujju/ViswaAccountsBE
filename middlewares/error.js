const parseError = require('../utils/error');

module.exports = function(err, req, res, next){

    console.log("middleware -> error.js");
    console.log(err);
    return res.status(500).send(parseError(err).message);
}