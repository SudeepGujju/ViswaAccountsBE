const router = require('express').Router();
const { validate, GroupModel, GroupType } = require('../models/group');
const { parseError } = require('../utils/error');
const { readCSVFile, deleteFile } = require('../utils/file');
const { FileFormats, UploadMiddleware } = require('../utils/file-upload');

const uploadConfig = { DestinationPath: global.tempPath, UseOriginalFileName: false, AllowedFileFormats: [FileFormats.CSV, FileFormats.XLS] };
const uploadGroupFile = UploadMiddleware(uploadConfig);

router.get("/dropdown", async function (req, res) {

    try {
        const groups = await GroupModel.find({ userId: req.user._id }).select('code name -_id').lean();

        return res.status(200).send(groups);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/:id", async function (req, res) {

    try {
        const group = await GroupModel.findOne({ _id: req.params.id, userId: req.user._id }).select('-userId -__v');

        if (!group)
            return res.status(404).send('Group with given id not found');

        return res.status(200).send(group);
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/", async function (req, res) {

    try {
        const groups = await GroupModel.find({ userId: req.user._id }).select('-userId -__v');

        return res.status(200).send(groups);
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

        let group = new GroupModel(req.body);

        group.userId = req.user._id;

        await group.save();

        return res.status(200).send("Group created successfully");
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

        const group = await GroupModel.findOneAndUpdate({_id: req.params.id}, {
            name: req.body.name,
            grpType: req.body.grpType
        }, { new: true, runValidators: true, context: 'query' });

        if (!group)
            return res.status(404).send('Group with given id not found');

        return res.status(200).send("Group updated successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }
});

router.delete("/:id", async function (req, res) {

    try {
        const group = await GroupModel.findOneAndRemove({_id: req.params.id});

        if (!group)
            return res.status(404).send('Group with given id not found');

        return res.status(200).send("Group deleted successfully");
    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.get("/codeAvailable/:code", async function(req, res){

    try{

        let bCodeAvail = await isCodeAvailabile(req.params.code, req.user._id);

        return res.status(200).send({ codeAvailable : bCodeAvail });

    }
    catch (ex) {
        const error = parseError(ex);
        return res.status(error.code).send(error.message);
    }

});

router.post("/upload", uploadGroupFile.single('file'), async function(req, res){ 

    try{

        if(!req.file)
            return res.status(400).send('File is required');

        let data = await readCSVFile(req.file.path);

        deleteFile(req.file.path);

        data = parseCSVForGroup(data);

        if(data.length > 0)
        {
            let records = await createGroups(data, req.user._id);

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
                message = "Error with all groups.";
            }
            else if(data.length == successCount)
            {
                status = 0;
                message = "Groups created successfully.";
            }
            else
            {
                status = 1;
                message = "Groups with error not created.";
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

        let group = await GroupModel.findOne({ 'code': code, 'userId': userID });

        if (group)
            bCodeAvail = false;//Not Available
    }
    catch (ex) {
        console.log(ex);
    }

    return bCodeAvail;
}

function parseCSVForGroup(results)
{
    if(!results)
        results = [];

    if(results.length == 0)
        return [];

    if(!results[0].TYPE || !results[0].CODE || !results[0].NAME)
    {
        return [];
    }

    results = results.map((x) => {

        let group = {};

        switch(x.TYPE.trim().toUpperCase())
        {
            case "TRADING": group.grpType = GroupType.Trading; break;
            case "PROFIT AND LOSS": group.grpType = GroupType.ProfitAndLoss; break;
            case "BALANCE SHEET": group.grpType = GroupType.BalanceSheet; break;
        }

        group.code = x.CODE.toUpperCase();
        group.name = x.NAME.toUpperCase();

        return group;
    });

    return results;

}

async function createGroups(records, userId){

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
    
            let group = new GroupModel(record);
    
            group.userId = userId;
    
            await group.save();

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