const router    = require('express').Router();
const fs        = require('fs');
const csv       = require('csv-parser');
const { getFilesList, isFileExists } = require('../utils/file');

router.get("/fileList", async function(req, res){

    try
    {
        let loginID = req.user.loginID.substr(0,3);

        let data = await getFilesList();

        let filesList = data.filter( x => x.endsWith(".csv") && x.startsWith(loginID) );

        return res.status(200).send(filesList);
    }
    catch(ex)
    {
        console.log(ex);
        return res.status(500).send("Internal server error");
    }
});

router.get("/fileData", async function(req, res){

    try
    {
        if(!req.query.filename)
            return res.status(400).send("Bad Request. Filename Missing");

        if( !await isFileExists(req.query.filename) )
            return res.status(404).send("Requested resource not found");

        let results = [];

        let filePath = "./uploads/"+req.query.filename;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data)=> results.push(data))
            .on('end', ()=>{

                let response = [];
                if(req.query.reportType == "GSTR2A-Invoice")
                {
                    response = fnPrcsDataForGSTInvoice(results)
                }
                else if(req.query.reportType == "GSTR2A-Summary")
                {
                    response = fnPrcsDataForGSTSummary(results);
                }
                else if(req.query.reportType == "GSTR2A")
                {
                    response = fnPrcsDataForGSTRA(results);
                }
                else if(req.query.reportType == "TAXWISE")
                {
                    response = fnPrcsDataTaxWise(results);
                }
                else
                {
                    response = results;
                }

                return res.status(200).send(response);
            });
    }
    catch(ex)
    {
        console.log(ex);
        return res.status(500).send("Internal server error");
    }

});

function groupBy(records, keysArr)
{
    let processedData = [];

    let helper = {}
    processedData = records.reduce((result, current)=>{

        const keys = [];
        keysArr.forEach((v,i)=>{
            keys.push(current[v]);
        });

        const key = keys.join(" - ");

        if(!helper[key])
        {
            helper[key] = Object.assign({}, current);

            if(helper[key].INVAMT)
                helper[key].INVAMT = parseFloat(helper[key].INVAMT).toFixed(2);

            helper[key].TAXABUL = +parseFloat(helper[key].TAXABUL).toFixed(2);
            helper[key].IGST = +parseFloat(helper[key].IGST).toFixed(2);
            helper[key].CGST = +parseFloat(helper[key].CGST).toFixed(2);
            helper[key].SGST = +parseFloat(helper[key].SGST).toFixed(2);
            helper[key].CSS = +parseFloat(helper[key].CSS).toFixed(2);

            result.push(helper[key]);
        }
        else
        {
            helper[key].TAXABUL = +( (parseFloat(helper[key].TAXABUL) + parseFloat(current.TAXABUL)).toFixed(2) );
            helper[key].IGST = +( (parseFloat(helper[key].IGST) + parseFloat(current.IGST)).toFixed(2) );
            helper[key].CGST = +( (parseFloat(helper[key].CGST) + parseFloat(current.CGST)).toFixed(2) );
            helper[key].SGST = +( (parseFloat(helper[key].SGST) + parseFloat(current.SGST)).toFixed(2) );
            helper[key].CSS = +( (parseFloat(helper[key].CSS) + parseFloat(current.CSS)).toFixed(2) );
        }

        return result;

    }, []);

    return processedData;
}

function fnPrcsDataForGSTRA(records)
{
    records = records
                .filter( x => x["GSTIN"])
                .map( x => {
                        x.INVAMT = +parseFloat(x.INVAMT).toFixed(2);
                        x.TAXABUL = +parseFloat(x.TAXABUL).toFixed(2);
                        x.IGST = +parseFloat(x.IGST).toFixed(2);
                        x.CGST = +parseFloat(x.CGST).toFixed(2);
                        x.SGST = +parseFloat(x.SGST).toFixed(2);
                        x.CSS = +parseFloat(x.CSS).toFixed(2);
                        return x;
                    });

    return records;
}

function fnPrcsDataForGSTInvoice(records)
{
    records = records
                .filter( x => x["GSTIN"])
                .map( x => {
                        delete x["TAX"];
                        delete x["TYPE"];
                        delete x["STATE"];
                        delete x["REV"];
                        return x;
                    });

    records = groupBy(records, ["GSTIN", "INVNO", "INVDATE"]);

    records.forEach((record,v)=>{

        let vInvAmt = parseFloat(record.INVAMT);

        let vTAXABUL = parseFloat(record.TAXABUL);
        let vIGST = parseFloat(record.IGST);
        let vCGST = parseFloat(record.CGST);
        let vSGST = parseFloat(record.SGST);
        let vCSS = parseFloat(record.CSS);

        record.DIFF = +(vInvAmt - vTAXABUL - vIGST - vCGST - vIGST - vSGST - vCSS).toFixed(2);
    });

    return records;
}

function fnPrcsDataForGSTSummary(records)
{
    records = records
                .filter( x => x["GSTIN"])
                .map( x => {
                        delete x["INVNO"];
                        delete x["TYPE"];
                        delete x["INVDATE"];
                        delete x["STATE"];
                        delete x["REV"];
                        delete x["TAX"];
                        delete x["INVAMT"];
                        return x;
                    });

    records = groupBy(records, ["GSTIN"]);

    return records;
}
let i = 0;
function fnPrcsDataTaxWise(records)
{
    let processedData = [];

    let helper = {}
    processedData = records.reduce((result, current)=>{

        if(current["GSTIN"] == "")
            return result;

        const keys = [];
        ["GSTIN", "INVNO", "INVDATE"].forEach((v,i)=>{
            keys.push(current[v]);
        });

        const key = keys.join(" - ");

        let vTAXABUL = +parseFloat(current.TAXABUL).toFixed(2);
        let vGST     = +( parseFloat(current.IGST) + parseFloat(current.CGST) + parseFloat(current.SGST) ).toFixed(2);
        let vTax     = parseInt(current.TAX);

        delete current["STATE"];
        delete current["REV"];
        delete current["IGST"];
        delete current["CGST"];
        delete current["SGST"];
        delete current["CSS"];
        delete current["STATUS"];
        delete current["MON"];
        delete current["TAX"];
        delete current["TAXABUL"];

        if(!helper[key])
        {
            helper[key] = Object.assign({}, current);

            helper[key]["0%"]   = 0.00;
            helper[key]["5%"]   = 0.00;
            helper[key]["12%"]  = 0.00;
            helper[key]["18%"]  = 0.00;
            helper[key]["28%"]  = 0.00;

            helper[key]["GST"]   = vGST;

            helper[key]["INVAMT"]   = +parseFloat(current.INVAMT).toFixed(2);

            helper[key]["ROUNDING"] = +(parseFloat(current.INVAMT) - parseFloat(vGST) - parseFloat(vTAXABUL)).toFixed(2);

            result.push(helper[key]);
        }
        else
        {
            helper[key]["GST"]   = +(parseFloat(helper[key]["GST"]) + parseFloat(vGST) ).toFixed(2);

            helper[key]["ROUNDING"] = +(parseFloat(helper[key]["ROUNDING"]) - parseFloat(vGST) - parseFloat(vTAXABUL)).toFixed(2);
        }

        //Updating value based object reference.
        switch(vTax)
        {
            case 0: helper[key]["0%"] = vTAXABUL; break;
            case 5: helper[key]["5%"] = vTAXABUL; break;
            case 12: helper[key]["12%"] = vTAXABUL; break;
            case 18: helper[key]["18%"] = vTAXABUL; break;
            case 28: helper[key]["28%"] = vTAXABUL; break;
        }

        return result;

    }, []);

    return processedData;
}

module.exports = router;