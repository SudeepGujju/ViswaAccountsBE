const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){

    try
    {
        let token = req.header(global.authHeader);

        if(!token)
            throw 'UnAuthorized Access';

        token = token.substring(7);

        const decoded = jwt.verify(token, global.publicKey, {algorithm: global.tokenAlgorithm});
		req.user = decoded;

        // let tokeniat = new Date(decoded.iat).getTime();

        // if(tokeniat < global.appStartTime.getTime())
        // {
        //     throw Error("Invalid token");
        // }

        next();
    }
    catch(ex)
    {
		return res.status(401).send("UnAuthorized Access");//( (ex ? ex : 'Invalid token') );
    }

};