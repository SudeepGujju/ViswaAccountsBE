const ObjectId = require("mongoose").Types.ObjectId;
const router = require('express').Router();
const { validate, AccountModel } = require('../models/account');
const { parseError } = require('../utils/error');
const { readCSVFile, deleteFile } = require('../utils/file');

const { FileFormats, UploadMiddleware } = require('../utils/file-upload');

const uploadConfig = { DestinationPath: global.tempPath, UseOriginalFileName: false, AllowedFileFormats: [FileFormats.CSV, FileFormats.XLS] };
const uploadAccountFile = UploadMiddleware(uploadConfig);

router.get("/dropdown", async function (req, res) {

    try {
        const accounts = await AccountModel.find({ userId: req.user._id }).select('code firmName town -_id').lean();

        return res.status(200).send(accounts);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/openingBalance", async function(req, res){

    try {

        const accountPipeline = [
            {
                '$match': { 'userId': ObjectId(req.user._id), 'opngBalAmt': {'$ne': 0} }
            },
            {
                '$project':{
                    _id: 0,
                    code: 1,
                    firmName: 1,
                    town: 1,
                    credit: { $cond: { if: { $lt: ['$opngBalAmt', 0] }, then: '$opngBalAmt', else: 0 }},
                    debit: { $cond: { if: { $gt: ['$opngBalAmt', 0] }, then: '$opngBalAmt', else: 0 }}
                }
            }
        ];

        const accounts = await AccountModel.aggregate(accountPipeline);

        return res.status(200).send(accounts);
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/:id", async function (req, res) {

    try {
        const account = await AccountModel.findOne({ _id: req.params.id, userId: req.user._id }).select('-userId');

        if (!account)
            return res.status(404).send('Account with given id not found');

        return res.status(200).send(account);
    }
    catch (ex) {
       
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/", async function (req, res) {

    try {
        const accounts = await AccountModel.find({ userId: req.user._id }).select('code firmName town proprietor phone gst groupCode opngBalAmt _id');

        return res.status(200).send(accounts);
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

        if (!await isCodeAvailabile(req.body.code, req.user._id))
            return res.status(400).send("code already exists");

        let account = new AccountModel(req.body);

        account.userId = req.user._id;

        await account.save();

        return res.status(200).send("Account created successfully");
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

        // firmName: req.body.firmName,
        // proprietor: req.body.proprietor,
        // phone: req.body.phone,
        // dno: req.body.dno,
        // strtNo: req.body.strtNo,
        // area: req.body.area,

        const account = await AccountModel.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, req.body, { new: true, runValidators: true, context: 'query' });

        if (!account)
            return res.status(404).send('Account with given id not found');

        return res.status(200).send("Account updated successfully");
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.delete("/:id", async function (req, res) {

    try {
        const account = await AccountModel.findOneAndRemove({_id: req.params.id});

        if (!account)
            return res.status(404).send('Account with given id not found');

        return res.status(200).send("Account deleted successfully");
    }
    catch (ex) {
        
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/codeAvailable/:code", async function(req, res){

    try{

        let bCodeAvail = await isCodeAvailabile(req.params.code, req.user._id);

        return res.status(200).send({ codeAvailable : bCodeAvail});

    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.post("/upload", uploadAccountFile.single('file'), async function(req, res){ 

    try{

        if(!req.file)
            return res.status(400).send('File is required');

        let data = await readCSVFile(req.file.path);

        deleteFile(req.file.path);

        data = parseCSVForAccounts(data);

        if(data.length > 0)
        {
            let records = await createAccounts(data, req.user._id);

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
                message = "Error with all accounts.";
            }
            else if(data.length == successCount)
            {
                status = 0;
                message = "Accounts created successfully.";
            }
            else
            {
                status = 1;
                message = "Accounts with error not created.";
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

async function isCodeAvailabile(code, userID) {

    let bCodeAvail = true;

    try {
        if (code)
            code = code.trim().toUpperCase();

        let account = await AccountModel.findOne({ 'code': code, 'userId': userID });

        if (account)
            bCodeAvail = false;
    }
    catch (ex) {
        console.log(ex);
    }

    return bCodeAvail;
}

function parseCSVForAccounts(results)
{
    if(!results)
        results = [];

    if(results.length == 0)
        return [];

    if(!results[0].CCODE || !results[0].CNAME || !results[0].GROUP)
    {
        return [];
    }

    results = results.map((x) => {

        let account = {};

        x.PHONE.replace = x.PHONE.replace(/[^\d]/g,'')

        account.code = x.CCODE.toUpperCase();
        account.firmName = x.CNAME;
        account.proprietor = x.PROPR;
        account.phone = x.PHONE.length == 10 ? x.PHONE : '';
        account.dno = x.CADD1
        account.strtNo = x.CADD2;
        account.town = x.CTOWN;
        account.dl1 = x.CDLNO1;
        account.dl2 = x.CDLNO2;
        account.gst = x.GSTNO;
        account.mailid = x.EMAIL;
        account.opngBalAmt = isNaN(x.OPENING) ? '0.00' : parseFloat(x.OPENING).toFixed(2);
        account.groupCode = x.GROUP.toUpperCase();
    
        return account;
    });

    return results;

}

async function createAccounts(records, userId){

    let response = records.map(async (record) => {
       
        let status = {id: record.code, success: false, errMsg:""};

        try {
            const { error } = validate(record);
    
            if (error)
            {
                status.errMsg = error.details[0].message;
                status.success = false;
                return;
            }
    
            if (!await isCodeAvailabile(record.code, userId))
            {
                status.errMsg = "code already exists";
                status.success = false;
                return;    
            }
    
            let account = new AccountModel(record);
    
            account.userId = userId;
    
            await account.save();

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