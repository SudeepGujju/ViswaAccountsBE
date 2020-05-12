const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){

    try
    {
        let token = req.header(global.authHeader);

        if(!token)
            throw 'UnAuthorized Access';

        token = token.substring(7);

        const decoded = jwt.verify(token, global.tokenSecret);
		req.user = decoded;

		next();
    }
    catch(ex)
    {
        // console.log(ex);
		return res.status(401).send("UnAuthorized Access");//( (ex ? ex : 'Invalid token') );
    }

};