const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const router = require("express").Router();
const {
    InventoryModel,
    InventoryType,
    CashRCredit,
} = require("../models/inventory");
const { BankModel } = require("../models/bank");
const { AccountModel } = require("../models/account");
const { GeneralVoucherModel } = require("../models/general-voucher");
const { GLCollectionModel, TrailBalanceCollectionModel } = require("../models/gl");
const { GroupType } = require("../models/group");
const {parseDate, formatDate} = require('../utils/format');

router.get("/prepare", async function (req, res) {

    let GLRecords = [];

    const session = await mongoose.startSession();
    session.startTransaction();

    try
    {
        //Delete previous GL documents of user.
        await GLCollectionModel.deleteMany({userId: req.user._id}).session(session);

        //Get Inventory documents of user.
        var records = await InventoryModel.find({
            userId: req.user._id,
        }).session(session);

        //Prepare GL documents of user from inventory.
        records.forEach((rec, idx) => {
            let orig = {}, repl = {};

            orig = { date: rec.invcDate, no: rec.SL, userId: req.user._id };
            repl = { date: rec.invcDate, no: rec.SL, userId: req.user._id };

            if (rec.invntryType == InventoryType.Sale)
            {
                let desc = "Sale: " + rec.invcNo;

                if (rec.cashRcredit == CashRCredit.Cash) 
                {
                    orig.code = "1000";
                    orig.desc = desc;
                    orig.credit = 0;
                    orig.debit = rec.totalInvcAmt;

                    repl.code = "1004";
                    repl.desc = desc;
                    repl.credit = rec.totalInvcAmt;
                    repl.debit = 0;
                }
                else if (rec.cashRcredit == CashRCredit.Credit) 
                {
                    orig.code = rec.toCode;
                    orig.desc = desc;
                    orig.credit = 0;
                    orig.debit = rec.totalInvcAmt;

                    repl.code = "1004";
                    repl.desc = desc;
                    repl.credit = rec.totalInvcAmt;
                    repl.debit = 0;
                }
            }
            else if (rec.invntryType == InventoryType.Purchase) 
            {
                let desc = "Purchase: " + rec.invcNo;

                if (rec.cashRcredit == CashRCredit.Cash) 
                {
                    orig.code = "1000";
                    orig.desc = desc;
                    orig.credit = rec.totalInvcAmt;
                    orig.debit = 0;

                    repl.code = "1002";
                    repl.desc = desc;
                    repl.credit = 0;
                    repl.debit = rec.totalInvcAmt;
                } 
                else if (rec.cashRcredit == CashRCredit.Credit) 
                {
                    orig.code = rec.toCode;
                    orig.desc = desc;
                    orig.credit = rec.totalInvcAmt;
                    orig.debit = 0;

                    repl.code = "1002";
                    repl.desc = desc;
                    repl.credit = 0;
                    repl.debit = rec.totalInvcAmt;
                }
            }
            else if (rec.invntryType == InventoryType.SaleReturn) 
            {
                let desc = "Sale Return: " + rec.invcNo;

                if (rec.cashRcredit == CashRCredit.Cash) 
                {
                    orig.code = "1000";
                    orig.desc = desc;
                    orig.credit = rec.totalInvcAmt;
                    orig.debit = 0;

                    repl.code = "1006";
                    repl.desc = desc;
                    repl.credit = 0;
                    repl.debit = rec.totalInvcAmt;
                } 
                else if (rec.cashRcredit == CashRCredit.Credit) 
                {
                    orig.code = rec.toCode;
                    orig.desc = desc;
                    orig.credit = rec.totalInvcAmt;
                    orig.debit = 0;

                    repl.code = "1006";
                    repl.desc = desc;
                    repl.credit = 0;
                    repl.debit = rec.totalInvcAmt;
                }
            }
            else if (rec.invntryType == InventoryType.PurchaseReturn) 
            {
                let desc = "Purchase Return: " + rec.invcNo;

                if (rec.cashRcredit == CashRCredit.Cash)
                {
                    orig.code = "1000";
                    orig.desc = desc;
                    orig.credit = 0;
                    orig.debit = rec.totalInvcAmt;

                    repl.code = "1007";
                    repl.desc = desc;
                    repl.credit = rec.totalInvcAmt;
                    repl.debit = 0;
                } 
                else if (rec.cashRcredit == CashRCredit.Credit) 
                {
                    orig.code = rec.toCode;
                    orig.desc = desc;
                    orig.credit = 0;
                    orig.debit = rec.totalInvcAmt;

                    repl.code = "1007";
                    repl.desc = desc;
                    repl.credit = rec.totalInvcAmt;
                    repl.debit = 0;
                }
            }
            else if (rec.invntryType == InventoryType.Other)
            {
                let desc = "Other: " + rec.invcNo;

                if (rec.cashRcredit == CashRCredit.Cash) 
                {
                    orig.code = "1000";
                    orig.desc = desc;
                    orig.credit = 0;
                    orig.debit = rec.totalInvcAmt;

                    repl.code = rec.fromCode;
                    repl.desc = desc;
                    repl.credit = rec.totalInvcAmt;
                    repl.debit = 0;
                }
                else if (rec.cashRcredit == CashRCredit.Credit) 
                {
                    orig.code = rec.toCode;
                    orig.desc = desc;
                    orig.credit = rec.totalInvcAmt;
                    orig.debit = 0;

                    repl.code = rec.fromCode;
                    repl.desc = desc;
                    repl.credit = 0;
                    repl.debit = rec.totalInvcAmt;
                }
            }

            GLRecords.push(orig, repl);
        });

            //Get Bank documents of user.
        records = await BankModel.find({userId: req.user._id}).session(session);

        //Prepare GL documents of user from bank documents.
        records.forEach((rec, idx) => {
            let orig = {}, repl = {};

            orig = { date: rec.date, no: rec.SL, userId: req.user._id, code: rec.fromCode, desc: rec.desc, credit: 0, debit: 0 };
            repl = { date: rec.date, no: rec.SL, userId: req.user._id, code: rec.toCode, desc: rec.desc, credit: 0, debit: 0};

            if(rec.payment > 0)
            {
                orig.credit =  rec.payment;
                repl.debit  = rec.payment;
            }
            else if(rec.receipt > 0)
            {
                orig.debit =  rec.receipt;
                repl.credit  = rec.receipt;
            }

            GLRecords.push(orig, repl);
        });

        const pipeline = [
            {
                $match: { "userId": ObjectId(req.user._id) },
            }, {
                $project: { "vouchList": 1, "No": 1, "date": 1, "_id": 1}
            }, {
                $unwind: "$vouchList"
            }
        ];

        //Get General Voucher documents of user.
        records = await GeneralVoucherModel.aggregate(pipeline).session(session);

        records.forEach((rec, idx) => {

            let orig = { date: rec.date, no: rec.No, userId: req.user._id, code: rec.vouchList.code, desc: rec.vouchList.desc, credit: rec.vouchList.crAmt, debit: rec.vouchList.dbAmt};

            GLRecords.push(orig);
        });

        await GLCollectionModel.insertMany(GLRecords, {session});

        /* Get group codes
        const GLGroupPipeline = [
            {
                '$lookup': {
                    'from': global.collections.account,
                    'let': {'accountCpy_code': '$code', 'accountCpy_userID': '$userId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$code', '$$accountCpy_code'] },
                                        {'$eq': ['$userId', '$$accountCpy_userID']}
                                    ]
                                }
                            }
                        },
                        {
                            '$project': { 'groupCode': 1, '_id': 0 }
                        },
                        {
                            '$lookup': {
                                'from': 'groups',
                                'let': {'accountCpyGrp_code': '$groupCode'},
                                'pipeline': [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    {'$eq': ['$code', '$$accountCpyGrp_code'] },
                                                    {'$eq': ['$userId', '$$accountCpy_userID']}
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        '$project': { 'grpType': 1, '_id': 0 }
                                    }
                                ],
                                'as': 'group'
                            }
                        },
                        {
                            '$unwind': '$group'
                        },
                        {
                            '$project': {'code': '$groupCode', 'type': '$group.grpType'}
                        }
                    ],
                    'as': 'group'
                }
            },
            {
                '$unwind': '$group'
            },
            {
                '$project': {'_id': 1, 'groupCode': '$group.code', 'groupType': '$group.type'}
            }
        ];

        const glCodeGroups = await GLCollectionModel.aggregate(GLGroupPipeline);

        for(let i=0; i < glCodeGroups.length; i++)
        {
            let glGroup = glCodeGroups[i];

            await GLCollectionModel.updateOne( {_id: glGroup._id}, { groupCode: glGroup.groupCode, groupType: glGroup.groupType});
        }
        */

        await TrailBalanceCollectionModel.deleteMany({userId: req.user._id}).session(session);

        //Trail Balance
        const TrailBalLedgerAgg = [
            {
                '$match': { 'userId': ObjectId(req.user._id) }
            },
            {
                '$project': {
                    '_id': 0,
                    'code': 1,
                    'firmName': 1,
                    'town': 1,
                    'groupCode': 1,
                    'openCredit': { $cond: { if: { $lt: ['$opngBalAmt', 0] }, then: { '$multiply': ['$opngBalAmt', -1] }, else: 0 }},
                    'openDebit': { $cond: { if: { $gt: ['$opngBalAmt', 0] }, then: '$opngBalAmt', else: 0 }},
                    'userId': 1
                }
            },
            {
                '$lookup': {
                    'from': global.collections.gl,
                    'let': {'account_code': '$code', 'account_userID': '$userId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$userId', '$$account_userID']},
                                        {'$eq': ['$code', '$$account_code'] }                                        
                                    ]
                                }
                            }
                        },
                        {
                            '$project': { 'credit': 1, 'debit': 1, '_id': 0 }
                        }
                    ],
                    'as': 'transactions'
                }
            },
            {
                '$set': {
                    'totalCredit': { '$sum': ['$openCredit', { '$sum': '$transactions.credit' }] },
                    'totalDebit': { '$sum': ['$openDebit', { '$sum': '$transactions.debit' }] }
                }
            },
            {
                '$match':{
                    '$or': [ {'totalCredit': {'$ne': 0}}, {'totalDebit': {'$ne': 0}} ]
                }
            },
            {
                '$unset': ['transactions']
            },
            {
                '$set': {
                    'balance': {'$subtract': ['$totalDebit', '$totalCredit']}
                }
            },
            {
                '$set':{
                    'balance String': { $trunc : [ '$balance', 2 ] }
                }
            },
            {
                '$lookup': {
                    'from': global.collections.group,
                    'let': {'group_code': '$groupCode', 'group_userID': '$userId'},
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {'$eq': ['$userId', '$$group_userID'] },
                                        {'$eq': ['$code', '$$group_code'] }
                                    ]
                                }
                            }
                        },
                        {
                            '$project': {
                                '_id': 0,
                                'groupType': '$grpType'
                            }
                        }
                    ],
                    'as': 'group'
                }
            },
            {
                '$replaceRoot': {
                    'newRoot': { '$mergeObjects': [{'$arrayElemAt': ['$group', 0]}, '$$ROOT'] }
                }
            },
            {
                '$unset': ['group']
            }
        ];

        records = await AccountModel.aggregate(TrailBalLedgerAgg).session(session);

        await TrailBalanceCollectionModel.insertMany(records, {session});

        // commit the changes if everything was successful
        await session.commitTransaction();

        return res.status(200).send();

    }catch(ex){

        // this will rollback any changes made in the database
        await session.abortTransaction();

        // rethrow the error
        throw ex;
    }
    finally{

        // ending the session
        session.endSession();
    }
});

router.get("/accountCopy", async function(req, res){

    let query = { userId: req.user._id, date: { $gte: parseDate(req.query.fromDate), $lte: parseDate(req.query.toDate)}, code: req.query.code };

    let accounts = await GLCollectionModel
                            .find(query)
                            .select('no date code desc credit debit')
                            .sort({"date": 1})
                            .lean();

    accounts.map( x => { x.date = formatDate(x.date) } );

    const { opngBalAmt } = await AccountModel.findOne({userId: req.user._id, "code": req.query.code}).select("-_id opngBalAmt").lean();

    let OpeningAccount = {no: "", date: "", code: req.query.code, desc: "Opening Balance", credit: 0, debit: 0};

    if(opngBalAmt < 0)
    {
        OpeningAccount.credit = opngBalAmt * -1;
    }
    else
    {
        OpeningAccount.debit = opngBalAmt;
    }

    accounts = [].concat(OpeningAccount).concat(accounts);

    let vPrevValue = 0;

    accounts.forEach((rec, idx) => {

        if(rec.credit > 0)
        {
            vPrevValue += rec.credit;
        }
        else if(rec.debit > 0)
            vPrevValue -= rec.debit;

        if(vPrevValue > 0)
        {
            rec.balance = vPrevValue.toFixed(2)+" Cr";
        }
        else if(vPrevValue < 0)
        {
            rec.balance = vPrevValue * -1;
            rec.balance = rec.balance.toFixed(2)+" Db";
        }
        else
            rec.balance = "0.00";
    });

    return res.status(200).send(accounts);
});

router.get("/trailBalance", async function(req, res){

    const query = { userId: req.user._id };

    const accounts = await TrailBalanceCollectionModel.find(query).select("-_id code firmName town balance").lean();

    accounts.forEach((rec, idx)=>{
        rec.credit = 0;
        rec.debit = 0;

        if(rec.balance < 0)
            rec.credit = (rec.balance * -1);
        else
            rec.debit = rec.balance;
    });

    return res.status(200).send(accounts);
});

router.get("/trading", async function(req, res){

    if(!req.query.closingStock)
        return res.status(400).send("Missing closing stock");

    const closingStock = parseFloat(req.query.closingStock);

    const query = { userId: req.user._id, groupType: GroupType.Trading };

    const accounts = await TrailBalanceCollectionModel.find(query).select("-_id code firmName balance").lean();

    let creditList = [{code: "CS", balance: closingStock, firmName: "Closing Stock"}], debitList =[];

    accounts.forEach((rec, idx)=>{

        if(rec.balance < 0)
        {
            rec.balance = (rec.balance * -1);
            creditList.push(rec);
        }
        else
        {
            debitList.push(rec);
        }
    });

    let maxRecordsCount = Math.max(debitList.length, creditList.length);

    let vTotalDebit = 0, vTotalCredit = closingStock;
    const tradingList = [];

    for(let i=0; i < maxRecordsCount; i++)
    {
        const record = {DbCode: "", DbAmount: "", DbAccName: "", CrCode: "", CrAmount: "", CrAccName: ""};

        if(debitList[i])
        {
            record.DbCode = debitList[i].code;
            record.DbAmount = debitList[i].balance.toFixed(2);
            record.DbAccName = debitList[i].firmName;

            vTotalDebit = +( parseFloat(vTotalDebit) + parseFloat(debitList[i].balance) ).toFixed(2);
        }

        if(creditList[i])
        {
            record.CrCode = creditList[i].code;
            record.CrAmount = creditList[i].balance.toFixed(2);
            record.CrAccName = creditList[i].firmName;

            vTotalCredit = +( parseFloat(vTotalCredit) + parseFloat(creditList[i].balance) ).toFixed(2);
        }

        tradingList.push(record);
    }

    const differenceAmount = +(vTotalDebit - vTotalCredit).toFixed(2);

    let grossLoss = 0, grossProfit = 0;

    if(differenceAmount < 0)
    {
        grossLoss = (differenceAmount * -1).toFixed(2);
    }
    else
    {
        grossProfit = differenceAmount.toFixed(2);
    }

    const response = {tradingList, totalCredit: vTotalCredit.toFixed(2), totalDebit: vTotalDebit.toFixed(2), grossLoss, grossProfit };

    return res.status(200).send(response);
});

router.get("/profitnloss", async function(req, res){

    if(!req.query.grossProfit && !req.query.grossLoss)
        return res.status(400).send("Missing gross amount");

    const grossProfit = parseFloat(req.query.grossProfit);
    const grossLoss = parseFloat(req.query.grossLoss);

    const query = { userId: req.user._id, groupType: GroupType.ProfitAndLoss };

    const accounts = await TrailBalanceCollectionModel.find(query).select("-_id code firmName balance").lean();

    let creditList = [], debitList =[];

    if(grossProfit > 0){
        creditList = [{code: "Gross Profit", balance: grossProfit, firmName: ""}];
    }

    if(grossLoss > 0){
        debitList = [{code: "Gross Loss", balance: grossLoss, firmName: ""}];
    }

    accounts.forEach((rec, idx)=>{

        if(rec.balance < 0)
        {
            rec.balance = (rec.balance * -1);
            creditList.push(rec);
        }
        else
        {
            debitList.push(rec);
        }
    });

    let maxRecordsCount = Math.max(debitList.length, creditList.length);

    let vTotalDebit = grossLoss, vTotalCredit = grossProfit;
    const profitNLossList = [];

    for(let i=0; i < maxRecordsCount; i++)
    {
        const record = {DbCode: "", DbAmount: "", DbAccName: "", CrCode: "", CrAmount: "", CrAccName: ""};

        if(debitList[i])
        {
            record.DbCode = debitList[i].code;
            record.DbAmount = debitList[i].balance.toFixed(2);
            record.DbAccName = debitList[i].firmName;

            vTotalDebit = +( parseFloat(vTotalDebit) + parseFloat(debitList[i].balance) ).toFixed(2);
        }

        if(creditList[i])
        {
            record.CrCode = creditList[i].code;
            record.CrAmount = creditList[i].balance.toFixed(2);
            record.CrAccName = creditList[i].firmName;

            vTotalCredit = +( parseFloat(vTotalCredit) + parseFloat(creditList[i].balance) ).toFixed(2);
        }

        profitNLossList.push(record);
    }

    const differenceAmount = +(vTotalDebit - vTotalCredit).toFixed(2);

    let netLoss = 0, netProfit = 0;

    if(differenceAmount < 0)
    {
        netLoss = (differenceAmount * -1).toFixed(2);
    }
    else
    {
        netProfit = differenceAmount.toFixed(2);
    }

    const response = {profitNLossList, totalCredit: vTotalCredit.toFixed(2), totalDebit: vTotalDebit.toFixed(2), netLoss, netProfit };

    return res.status(200).send(response);
});

router.get("/balanceSheet", async function(req, res){

    if(!req.query.closingStock)
        return res.status(400).send("Missing closing stock");

    const query = { userId: req.user._id, groupType: GroupType.BalanceSheet };

    const accounts = await TrailBalanceCollectionModel.find(query).select("-_id code firmName balance").lean();

    let creditList = [{code: "CS", balance: parseFloat(req.query.closingStock), firmName: "Closing Stock"}], debitList =[];

    accounts.forEach((rec, idx)=>{

        if(rec.balance < 0)
        {
            rec.balance = (rec.balance * -1);
            creditList.push(rec);
        }
        else
        {
            debitList.push(rec);
        }
    });

    let maxRecordsCount = Math.max(debitList.length, creditList.length);

    let vTotalDebit = 0, vTotalCredit = 0;
    const balanceSheetList = [];

    for(let i=0; i < maxRecordsCount; i++)
    {
        const record = {DbCode: "", DbAmount: "", DbAccName: "", CrCode: "", CrAmount: "", CrAccName: ""};

        if(debitList[i])
        {
            record.DbCode = debitList[i].code;
            record.DbAmount = debitList[i].balance.toFixed(2);
            record.DbAccName = debitList[i].firmName;

            vTotalDebit = +( parseFloat(vTotalDebit) + parseFloat(debitList[i].balance) ).toFixed(2);
        }

        if(creditList[i])
        {
            record.CrCode = creditList[i].code;
            record.CrAmount = creditList[i].balance.toFixed(2);
            record.CrAccName = creditList[i].firmName;

            vTotalCredit = +( parseFloat(vTotalCredit) + parseFloat(creditList[i].balance) ).toFixed(2);
        }

        balanceSheetList.push(record);
    }

    const response = {balanceSheetList, totalCredit: vTotalCredit.toFixed(2), totalDebit: vTotalDebit.toFixed(2) };

    return res.status(200).send(response);
});

module.exports = router;