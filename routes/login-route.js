const router = require('express').Router();
const { validateLogin, UserModel, UserStatus} = require('../models/user');
const bcrypt    = require('bcrypt');
const { parseError } = require('../utils/error');

router.post("/", async function(req, res){
	try
	{
        let {error} = validateLogin(req.body);

		if(error)return res.status(400).send(error.details[0].message);

		let user = await UserModel.findOne({'loginID': req.body.loginID, 'status': UserStatus.Active});

		if(!user)return res.status(400).send("Invalid login ID or password");

		let isValid = await bcrypt.compare(req.body.password, user.password);

		if(!isValid)return res.status(400).send("Invalid login ID or password");

        const token = user.generateAuthToken();

        const userDetails = user.toJSON();

        delete userDetails.password;

        return res.header(global.authHeader, "Bearer "+token).status(200).send(userDetails);

    }
	catch(e)
	{
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
	}
});

module.exports = router;