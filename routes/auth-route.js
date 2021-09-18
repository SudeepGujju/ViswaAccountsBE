const router = require('express').Router();
const { validateLogin, UserModel, UserStatus} = require('../models/user');
const bcrypt = require('bcrypt');
const { parseError } = require('../utils/error');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { ActiveUsersModel } = require('../models/active-users');
const { getParsedSchemaToken } = require('../utils/token');

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

		userDetails.finYearStart = new Date(parseInt(userDetails.finYear.split('-')[0], 10), 3, 1);
		userDetails.finYearEnd = new Date(parseInt(userDetails.finYear.split('-')[1], 10), 2, 31);

		let {accessToken, refreshToken} = generateTokens(userDetails._id);

		userDetails.accessToken = accessToken;
		userDetails.refreshToken = refreshToken;

		const activeUser = new ActiveUsersModel({
			accessToken: accessToken,
			refreshToken: refreshToken,
			user: {
				loginID: userDetails.loginID,
				username: userDetails.username,
				finYearStart: userDetails.finYearStart,
				finYearEnd: userDetails.finYearEnd,
				_id: userDetails._id
			},
			lastAccessed: new Date()
		});

		await activeUser.save();

        return res.status(200).send(userDetails);
    }
	catch(e)
	{
		// console.log(e);
        const error = parseError(e);
        return res.status(error.code).send(error.message);
	}
});

router.post("/logout", async function(req, res){

	try
	{
		//No need to wait until logged out successfully.
		ActiveUsersModel.deleteOne({'accessToken': getParsedSchemaToken(req) }).exec();
	}
	catch(e)
	{
		//console.log(e);
	}

	return res.status(200).send("Logged out successfully.");
});

router.post("/refresh", async function(req, res){

	try
	{
		const refreshToken = req.body.refreshToken;

		let oldAcessToken = getParsedSchemaToken(req);

		const activeUser = await ActiveUsersModel.findOne({'refreshToken': refreshToken });

		if(!activeUser)
		{
			throw new Error("User session expired");
		}

		let bIsTokenExpired = false;

		try
		{
			jwt.verify(oldAcessToken, global.publicKey, {algorithms: [global.tokenAlgorithm]} );
		}
		catch(e)
		{
			if(e instanceof jwt.TokenExpiredError){
				bIsTokenExpired = true;
			}
		}

		if(bIsTokenExpired)
		{
			let accessToken = generateAccessToken(activeUser.user._id);

			activeUser.accessToken = accessToken;
			activeUser.lastAccessed = new Date();

			await activeUser.save();

			return res.status(200).send({accessToken});
		}
	}
	catch(e)
	{
		// console.log(e);
	}

	return res.status(401).send("Session expired. Please relogin.");

});

function generateTokens(userId)
{
	const refreshToken = crypto.randomBytes(16).toString('hex');

	const accessToken = generateAccessToken(userId);

	return {accessToken, refreshToken};
}//generateTokens

function generateAccessToken(userId){

	const payload = {sub: userId };

	const accessToken = jwt.sign(
		payload,
		global.privateKey,
		{algorithm: global.tokenAlgorithm, expiresIn: global.sessionValidityInSecs }
	);

	return accessToken;
}//generateAccessToken

module.exports = router;