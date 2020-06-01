const router = require('express').Router();
const { validate, GeneralVoucherModel } = require('../models/general-voucher');
const { parseError } = require('../utils/error');
const {parseDate, formatDate} = require('../utils/format');

router.get("/nextRecordID", async function (req, res) {

    try {

        const vouchers = await GeneralVoucherModel.find({ userId: req.user._id}).select('No').lean();

        let nextRecId = 1;

        if(vouchers && vouchers.length > 0){

            const items = vouchers.map(x => parseInt(x.No) );

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
        const voucher = await GeneralVoucherModel.findOne({ _id: req.params.id, userId: req.user._id }).select('-userId -__v').lean();

        if (!voucher)
            return res.status(404).send('General Voucher with given id not found');

		voucher.date = formatDate(voucher.date);

        return res.status(200).send(voucher);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/", async function (req, res) {

    try {
        const vouchers = await GeneralVoucherModel.find({ userId: req.user._id }).select('-userId -__v -vouchList').lean();

        // x.totDbAmt = parseFloat(x.totDbAmt).toFixed(2); x.totCrAmt = parseFloat(x.totCrAmt).toFixed(2) 
		vouchers.forEach( x => { x.date = formatDate(x.date);} );

        return res.status(200).send(vouchers);
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

        const { error } = validate(req.body, req.user.finYearStart, req.user.finYearEnd);

        if (error)
            return res.status(400).send(error.details[0].message);

        let voucher = new GeneralVoucherModel(req.body);

        voucher.userId = req.user._id;

        await voucher.save();

        return res.status(200).send("General Voucher created successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.put("/:id", async function (req, res) {

    try
	{
        let removedIds = req.body.removedVoucherIds || [];

        delete req.body.removedVoucherIds;

		if(req.body.date)
            req.body.date = parseDate(req.body.date);

        const { error } = validate(req.body, req.user.finYearStart, req.user.finYearEnd);

        if (error)
            return res.status(400).send(error.details[0].message);

        const genVoucher = await GeneralVoucherModel.findOne({_id: req.params.id});//userId: req.user._id

        if(!genVoucher)
            return res.status(404).send('General Voucher with given id not found');

        genVoucher.date = req.body.date;
        genVoucher.totDbAmt = req.body.totDbAmt;
        genVoucher.totCrAmt = req.body.totCrAmt;

        for( let i=0; i < removedIds.length; i++)
        {
            genVoucher.vouchList.id(removedIds[i]).remove();
        }

        let vouchList = req.body.vouchList;

        for( let i=0; i < vouchList.length; i++)
        {
            let voucher = vouchList[i];
            let id = voucher._id;

            delete voucher._id;

            if(id.length == 0)
            {
                genVoucher.vouchList.push(voucher);
            }
            else
            {
                let doc = genVoucher.vouchList.id(id);

                doc.code = voucher.code;
                doc.desc = voucher.desc;
                doc.dbAmt = voucher.dbAmt;
                doc.crAmt = voucher.crAmt;
            }
        }

        await genVoucher.save();

        return res.status(200).send("General Voucher updated successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.delete("/:id", async function (req, res) {

    try {

        const voucher = await GeneralVoucherModel.findOneAndRemove({_id: req.params.id});

        if (!voucher)
            return res.status(404).send('General Voucher with given id not found');

        return res.status(200).send("General Voucher deleted successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

module.exports = router;