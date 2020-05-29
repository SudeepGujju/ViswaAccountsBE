const router = require('express').Router();
const { validate, InventoryModel, InventoryType, CashRCredit } = require('../models/inventory');
const { parseError } = require('../utils/error');
const { parseDate, formatDate} = require('../utils/format');
const upload = require('../utils/file-upload')(global.tempPath);
const { readCSVFile, deleteFile } = require('../utils/file');

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

        const { error } = validate(req.body, req.user.finYearStart, req.user.finYearEnd);

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

        const { error } = validate(req.body, req.user.finYearStart, req.user.finYearEnd);

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

router.post("/upload", upload.single('file'), async function(req, res){

    try{

        if(!req.file)
            return res.status(400).send('File is required');
        
        let data = await readCSVFile(req.file.path);

        deleteFile(req.file.path);

        data = parseCSVInventory(data);

        if(data.length > 0)
        {
            let records = await createInventories(data, req.user._id, req.user.finYearStart, req.user.finYearEnd);

            let successCount = 0, failedCount = 0;

            records = records.filter((x)=>{

                let success = x.success;

                if(success)
                    successCount++;
                else
                    failedCount++;

                delete x.success;

                return !success;
            });

            let message = "";
            let status = 0;

            if(data.length == failedCount)
            {
                status = 2;
                message = "Error with all inventories.";
            }
            else if(data.length == successCount)
            {
                status = 0;
                message = "Inventories created successfully.";
            }
            else
            {
                status = 1;
                message = "Inventories with error not created.";
            }

            let response = {
                totalCount: data.length,
                successCount,
                failedCount,
                failedRecs: records,
                message,
                status
            };

            return res.status(200).send(response);
        }
        else
        {
            return res.status(400).send("Invalid or empty file.");
        }
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

module.exports = router;

function parseCSVInventory(results){

    if(!results)
        results = [];

    if(results.length == 0)
        return [];

    results = results.map((x) => {

        let inventory = {};

        switch(x.TYPE.trim().toUpperCase())
        {
            case "SALE":            inventory.invntryType = InventoryType.Sale; break;
            case "PURCHASE":        inventory.invntryType = InventoryType.Purchase; break;
            case "SALERETURN":      inventory.invntryType = InventoryType.SaleReturn; break;
            case "SALERETURN":      inventory.invntryType = InventoryType.PurchaseReturn; break;
            case "OTHER":           inventory.invntryType = InventoryType.Other; break;
        }

        switch(x.FCRDR.trim().toUpperCase())
        {
            case "R":        inventory.cashRcredit = CashRCredit.Credit; break;
            case "C":        inventory.cashRcredit = CashRCredit.Cash; break;
        }

        inventory.SL = x.SLNO;
        inventory.date = x.DATE;
        inventory.fromCode = x.GLCODE;
        inventory.toCode = x.CODE1;
        inventory.invcNo = x.INVNO;
        inventory.invcDate = x.INVDATE;
        inventory.fiveAmt = isNaN(x.AMT5) ? '0.00' : parseFloat(x.AMT5).toFixed(2);
        inventory.fivePerAmt = isNaN(x.TAX5) ? '0.00' : parseFloat(x.TAX5).toFixed(2);
        inventory.twelveAmt = isNaN(x.AMT12) ? '0.00' : parseFloat(x.AMT12).toFixed(2);
        inventory.twelvePerAmt = isNaN(x.TAX12) ? '0.00' : parseFloat(x.TAX12).toFixed(2);
        inventory.eighteenAmt = isNaN(x.AMT18) ? '0.00' : parseFloat(x.AMT18).toFixed(2);
        inventory.eighteenPerAmt = isNaN(x.TAX18) ? '0.00' : parseFloat(x.TAX18).toFixed(2);
        inventory.twntyEightAmt = isNaN(x.AMT28) ? '0.00' : parseFloat(x.AMT28).toFixed(2);
        inventory.twntyEightPerAmt = isNaN(x.TAX28) ? '0.00' : parseFloat(x.TAX28).toFixed(2);
        inventory.zeroAmt = isNaN(x.AMT0) ? '0.00' : parseFloat(x.AMT0).toFixed(2);
        inventory.totalAmt = isNaN(x.TAMT) ? '0.00' : parseFloat(x.TAMT).toFixed(2);
        inventory.totalPerAmt = isNaN(x.TTAX) ? '0.00' : parseFloat(x.TTAX).toFixed(2);
        inventory.roundingAmt = isNaN(x.ROUN) ? '0.00' : parseFloat(x.ROUN).toFixed(2);
        inventory.totalInvcAmt = isNaN(x.INVAMT) ? '0.00' : parseFloat(x.INVAMT).toFixed(2);

        return inventory;
    });

    return results;

}

async function createInventories(records, userId, finYearStart, finYearEnd){

    let response = records.map(async (record) => {

        let status = {id: record.SL, success: false, errMsg:""};

        try {
            const { error } = validate(record, finYearStart, finYearEnd);
    
            if (error)
            {
                status.errMsg = error.details[0].message;
                status.success = false;
                return;
            }

            let inventory = new InventoryModel(record);

            inventory.userId = userId;

            await inventory.save();

            status.success = true;
        }
        catch (ex) {
            const error = parseError(ex);

            status.errMsg =  error.message;
            status.success = false;
        }
        finally
        {
            return status;
        }

    });

    return Promise.all(response);
}