const express = require('express');
const http = require('http');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "/dist/giftshop")));

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"/uploads") );
    },
    filename: function(req, file, cb){
        // console.log(file);
        cb(null, file.originalname+"");
    }
})
const upload = multer({storage: storage});

app.post("/api/upload", upload.single('record'), function(req, res){

    res.send("File received successfully");
});

app.get("/api/getCSVFilesList", function(req, res){

    let filesList = [];

    fs.readdir(__dirname+"/uploads", function(err, files){

        if(err)
            return res.status(500).send("Internal server error");

        filesList = files.filter( x => x.endsWith(".csv") );

        return res.status(200).send(filesList);
    });
});

app.get("/api/getCSVData/", function(req, res){

    let results = [];
    let filePath = "./uploads/"+req.query.filename;

    if(fs.existsSync(filePath))
    {
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
                else
                {
                    response = fnPrcsDataForGST2R(results);
                }
                return res.status(200).send(response);
            });
    }
    else
    {
        return res.status(404).send();
    }
});

app.get("/*", function (req, res, next) {
    return res.sendFile(
        path.join(__dirname, "/dist/giftshop/index.html")
    );
});

app.use('**', function (req, res) {
    res.status(404);
    res.send('Invalid request method/url');
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

            helper[key].TAXABUL = parseFloat(helper[key].TAXABUL).toFixed(2);
            helper[key].IGST = parseFloat(helper[key].IGST).toFixed(2);
            helper[key].CGST = parseFloat(helper[key].CGST).toFixed(2);
            helper[key].SGST = parseFloat(helper[key].SGST).toFixed(2);
            helper[key].CSS = parseFloat(helper[key].CSS).toFixed(2);

            result.push(helper[key]);
        }
        else
        {
            helper[key].TAXABUL = (parseFloat(helper[key].TAXABUL) + parseFloat(current.TAXABUL)).toFixed(2);
            helper[key].IGST = (parseFloat(helper[key].IGST) + parseFloat(current.IGST)).toFixed(2);
            helper[key].CGST = (parseFloat(helper[key].CGST) + parseFloat(current.CGST)).toFixed(2);
            helper[key].SGST = (parseFloat(helper[key].SGST) + parseFloat(current.SGST)).toFixed(2);
            helper[key].CSS = (parseFloat(helper[key].CSS) + parseFloat(current.CSS)).toFixed(2);
        }

        return result;

    }, []);

    return processedData;
}

function fnPrcsDataForGST2R(records)
{
    records = records
                .filter( x => x["GSTIN"])
                .map( x => {
                        x.INVAMT = parseFloat(x.INVAMT).toFixed(2);
                        x.TAXABUL = parseFloat(x.TAXABUL).toFixed(2);
                        x.IGST = parseFloat(x.IGST).toFixed(2);
                        x.CGST = parseFloat(x.CGST).toFixed(2);
                        x.SGST = parseFloat(x.SGST).toFixed(2);
                        x.CSS = parseFloat(x.CSS).toFixed(2);
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

        record.DIFF = (vInvAmt - vTAXABUL - vIGST - vCGST - vIGST - vSGST - vCSS).toFixed(2);

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