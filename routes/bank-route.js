const router = require('express').Router();
const { validate, BankModel } = require('../models/bank');
const { parseError } = require('../utils/error');
const {parseDate, formatDate} = require('../utils/format');

router.get("/search", async function (req, res) {

    try {

        const banks = await BankModel.find({ userId: req.user._id, date: { $gte: parseDate(req.query.fromDate), $lte: parseDate(req.query.toDate)}, $or: [ {fromCode: req.query.code}, {toCode: req.query.code} ] }).select('-userId').lean();

        banks.map( x => { x.date = formatDate(x.date) } );

        return res.status(200).send(banks);
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/nextRecordID", async function (req, res) {

    try {

        const banks = await BankModel.find({ userId: req.user._id, date: parseDate(req.query.date) }).select('SL').lean();

        let nextRecId = 1;

        if(banks && banks.length > 0){

            const items = banks.map(x => parseInt(x.SL) );

            nextRecId = (Math.max(...items) + 1);
        }

        return res.status(200).send({nextRecId});
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/:id", async function (req, res) {

    try {
        const bank = await BankModel.findOne({ _id: req.params.id, userId: req.user._id }).select('-userId').lean();

        if (!bank)
            return res.status(404).send('Record with given id not found');

        bank.date = formatDate(bank.date);
        // bank.payment = parseFloat(bank.payment).toFixed(2);
        // bank.reciept = parseFloat(bank.reciept).toFixed(2);

        return res.status(200).send(bank);
    }
    catch (ex) {
       
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});


router.get("/", async function (req, res) {

    try {

        const banks = await BankModel.find({ userId: req.user._id, fromCode: req.query.code, date: parseDate(req.query.date) }).select('-userId').lean();

        banks.map( x => { x.date = formatDate(x.date) } );

        return res.status(200).send(banks);
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.post("/", async function (req, res) {

    try {

        if(req.body.date)
            req.body.date = parseDate(req.body.date);

        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);

        let bank = new BankModel(req.body);

        bank.userId = req.user._id;

        await bank.save();

        return res.status(200).send("Record created successfully");
    }
    catch (ex) {

        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.put("/:id", async function (req, res) {

    try {

        if(req.body.date)
            req.body.date = parseDate(req.body.date);

        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);

        const bank = await BankModel.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, req.body, { new: true, runValidators: true, context: 'query' });

        if (!bank)
            return res.status(404).send('Record with given id not found');

        return res.status(200).send("Record updated successfully");
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.delete("/:id", async function (req, res) {

    try {
        const bank = await BankModel.findOneAndRemove({_id: req.params.id});

        if (!bank)
            return res.status(404).send('Record with given id not found');

        return res.status(200).send("Record deleted successfully");
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

module.exports = router;