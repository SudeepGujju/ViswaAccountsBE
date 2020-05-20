const router = require('express').Router();
const { parseError } = require('../utils/error');
const { validate, ProductModel } = require('../models/product');
const upload = require('../utils/file-upload')(global.tempPath);
const { readCSVFile, deleteFile } = require('../utils/file');

router.get("/search", async function (req, res) {

    try {

        const query = {name: {$regex: req.query.name+".*", $options: 'i'}};

        if(req.query.currUserOnly == '1')
            query.userId = req.user._id;

        const products = await ProductModel.find(query).select('-_id -__v').populate('user', 'username phone -_id').lean();

        return res.status(200).send(products);
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

        data = await parseCSVForProduct(data);

        if(data.length > 0)
        {
            const deleteStatus = await ProductModel.deleteMany({userId: req.user._id});

            // console.log(deleteStatus);

            let records = await createProducts(data, req.user._id);

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
                message = "Error with all products.";
            }
            else if(data.length == successCount)
            {
                status = 0;
                message = "Products created successfully";
            }
            else
            {
                status = 1;
                message = "Products with error not created.";
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

function parseCSVForProduct(results)
{
    if(!results)
        results = [];

    if(results.length == 0)
        return [];

    results = results.map((x) => {

        let product = {};

        product.name    = x.Name.toUpperCase();
        product.packing = x.Packing.toUpperCase();
        product.company = x.CName.toUpperCase();
        product.qty     = x.QTY || "0";
        product.mrp     = x.MRP || "0.00";

        return product;
    });

    return results;
}

async function createProducts(records, userId){

    let response = records.map(async (record) => {
       
        let status = {id: record.name, success: false, errMsg:""};

        try {
            const { error } = validate(record);
    
            if (error)
            {
                status.errMsg = error.details[0].message;
                status.success = false;
                return;
            }
    
            let product = new ProductModel(record);
    
            product.userId = userId;
    
            await product.save();

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