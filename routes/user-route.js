const bcrypt = require('bcrypt');
const router = require('express').Router();
const { UserModel, validate, validatePermissions } = require('../models/user');
const { parseError } = require('../utils/error');

router.get("/:id", async function (req, res) {

    try {
        const user = await UserModel.findOne({_id: req.params.id}).select('-password -__v -permissions');

        if (!user)
            return res.status(404).send('User with given id not found');

        return res.status(200).send(user);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.get("/", async function (req, res) {

    try {

        const users = await UserModel.find().select('-password -__v -permissions');

        return res.status(200).send(users);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.post("/", async function (req, res) {

    try {
        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);

        if (!await isLoginIDAvailabile(req.body.loginID))
            return res.status(400).send("Login ID already exists");

        let user = new UserModel(req.body);

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        return res.status(200).send("User created successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.put("/:id", async function (req, res) {

    try {
        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);
        
        if(req.body.password)
        {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);   
        }

        const account = await UserModel.findOneAndUpdate({_id: req.params.id}, req.body, { new: true, runValidators: true, context: 'query' });

        if (!account)
            return res.status(404).send('User with given id not found');

        return res.status(200).send("User updated successfully");
    }
    catch (ex) {

        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.delete("/:id", async function (req, res) {
    try {
        const user = await UserModel.findOneAndRemove({_id: req.params.id});

        if (!user)
            return res.status(404).send("User with given ID not found.");

        return res.status(200).send("User deleted successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.get("/permissions/:id", async function (req, res) {
    try {
        const permissions = await UserModel.findOne({_id: req.params.id}).select('permissions');

        if (!permissions)
            return res.status(404).send('User with given id not found');

        return res.status(200).send(permissions);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.post("/permissions/:id", async function (req, res) {
    try {

        const { error } = validatePermissions(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);

        const permissions = await UserModel.findOneAndUpdate({_id: req.params.id}, req.body, { new: true, runValidators: true, context: 'query' });//.select('_id permissions');

        if (!permissions)
            return res.status(404).send('User with given id not found');

        return res.status(200).send("Permissions updated successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

module.exports = router;

async function isLoginIDAvailabile(loginID) {

    let bUserAvail = true;

    try {
        if (loginID)
            loginID = loginID.trim().toUpperCase();

        let user = await UserModel.findOne({ 'loginID': loginID });

        if (user)
            bUserAvail = false;//Not Available
    }
    catch (ex) {
        console.log(ex);
    }

    return bUserAvail;
}