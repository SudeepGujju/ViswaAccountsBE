const router = require('express').Router();
const { validateLogin, UserModel, UserStatus} = require('../models/user');
const bcrypt    = require('bcrypt');
const { parseError } = require('../utils/error');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

router.post("/login", async function(req, res){

	try
	{
        let {error} = validateLogin(req.body);

		if(error)return res.status(400).send(error.details[0].message);

		let user = await UserModel.findOne({'loginID': req.body.loginID, 'status': UserStatus.Active});

		if(!user)return res.status(400).send("Invalid login ID or password");

		let isValid = await bcrypt.compare(req.body.password, user.password);

		if(!isValid)return res.status(400).send("Invalid login ID or password");

        //const token = user.generateAuthToken();

        const userDetails = user.toJSON();

		delete userDetails.password;

		let tokens = generateTokens(userDetails._id, userDetails.username);

		userDetails.accessToken = tokens.accessToken;
		userDetails.refreshToken = tokens.refreshToken;

        return res.status(200).send(userDetails);

    }
	catch(e)
	{
		// console.log(e);
        const error = parseError(e);
        return res.status(error.code).send(error.message);
	}
});

router.post("/refresh", async function(req, res){

	const refreshToken = req.body.refreshToken;

	if(refreshToken in global.userTokens)
	{
		let tokenExpiredTime = null;
		try
		{
			jwt.verify(token, global.tokenSecret);
		}
		catch(e)
		{
			if(e instanceof jwt.TokenExpiredError){
				tokenExpiredTime = e.expiredAt.getTime();
			}
		}

		if(tokenExpiredTime <  (new Date().getTime() + (15 * 60 * 1000)) )
		{
			let accessToken = jwt.sign(
								global.userTokens[refreshToken].payload,
								global.tokenSecret,
								{ expiresIn: '15m' }//(15 * 60 * 1000)ms;
							);

			global.userTokens[refreshToken].accessToken = accessToken;

			return res.status(200).send({accessToken})
		}
		else
		{
			return res.status(401).send("session expired. Please relogin.");
		}
	}
	else
	{
		return res.status(401).send("session expired. Please relogin.");
	}

});

function generateTokens(id, username)
{
	const refreshToken = crypto.randomBytes(16).toString('hex');

	const accessToken = jwt.sign(
							{_id: id, username},
							global.tokenSecret,
							{ expiresIn: '15m' }//(15 * 60 * 1000)ms; 15 - mins
						);

	global.userTokens[refreshToken] = { payload: {_id: id, username}, accessToken };

	return {accessToken, refreshToken};
}

module.exports = router;