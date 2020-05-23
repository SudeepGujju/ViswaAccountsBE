const router = require('express').Router();
const { validate, InventoryModel } = require('../models/inventory');
const { parseError } = require('../utils/error');
const {parseDate, formatDate} = require('../utils/format');

router.get("/nextRecordID", async function (req, res) {

    try {

        const invetories = await InventoryModel.find({ userId: req.user._id, invntryType: req.query.inventoryType }).select('SL').lean();

        let nextRecId = 1;

        if(invetories && invetories.length > 0){

            const items = invetories.map(x => parseInt(x.SL) );

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
        const inventory = await InventoryModel.findOne({ _id: req.params.id, userId: req.user._id }).select('-userId -__v').lean();

        if (!inventory)
            return res.status(404).send('Inventory with given id not found');
		
		inventory.date = formatDate(inventory.date);
		inventory.invcDate = formatDate(inventory.invcDate);

        return res.status(200).send(inventory);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/", async function (req, res) {

    try {
        const inventories = await InventoryModel.find({ userId: req.user._id }).select('-userId -__v').lean();
		
		inventories.map( x => { x.date = formatDate(x.date);  x.invcDate = formatDate(x.invcDate); } );

        return res.status(200).send(inventories);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.post("/", async function (req, res) {

    try
	{
		if(req.body.date)
            req.body.date = parseDate(req.body.date);

		if(req.body.invcDate)
            req.body.invcDate = parseDate(req.body.invcDate);

        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);

        let inventory = new InventoryModel(req.body);

        inventory.userId = req.user._id;

        await inventory.save();

        return res.status(200).send("Inventory created successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.put("/:id", async function (req, res) {

    try
	{
		if(req.body.date)
            req.body.date = parseDate(req.body.date);

		if(req.body.invcDate)
            req.body.invcDate = parseDate(req.body.invcDate);

        const { error } = validate(req.body);

        if (error)
            return res.status(400).send(error.details[0].message);

        const inventory = await InventoryModel.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, {
            date: req.body.date,
            cashRcredit: req.body.cashRcredit,
            fromCode: req.body.fromCode,
            toCode: req.body.toCode,
            invcNo: req.body.invcNo,
            invcDate: req.body.invcDate,
            fiveAmt: req.body.fiveAmt,
            twelveAmt: req.body.twelveAmt,
            twelvePerAmt: req.body.twelvePerAmt,
            eighteenAmt: req.body.eighteenAmt,
            eighteenPerAmt: req.body.eighteenPerAmt,
            twntyEightAmt: req.body.twntyEightAmt,
            twntyEightPerAmt: req.body.twntyEightPerAmt,
            zeroAmt: req.body.zeroAmt,
            totalAmt: req.body.totalAmt,
            totalPerAmt: req.body.totalPerAmt,
            roundingAmt: req.body.roundingAmt,
            totalInvcAmt: req.body.totalInvcAmt
        }, { new: true, runValidators: true, context: 'query' });

        if(!inventory)
            return res.status(404).send('Inventory with given id not found');

        return res.status(200).send("Inventory updated successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.delete("/:id", async function (req, res) {

    try {

        const inventory = await InventoryModel.findOneAndRemove({_id: req.params.id});

        if (!inventory)
            return res.status(404).send('Inventory with given id not found');

        return res.status(200).send("Inventory deleted successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

module.exports = router;