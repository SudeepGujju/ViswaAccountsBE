const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId, validateRefFld } = require('../utils/model-validators');

const InventoryType = Object.freeze({Sale: 1, Purchase: 2, SaleReturn: 3, PurchaseReturn: 4, Other: 5 });
const CashRCredit   = Object.freeze({Cash: 1, Credit: 2});

const Schema = mongoose.Schema;

const inventoryCollectionSchema = new Schema({
    invntryType: {
        type: Number,
        enum: [InventoryType.Sale, InventoryType.Purchase, InventoryType.SaleReturn, InventoryType.PurchaseReturn, InventoryType.Other],
        required: true
    },
    SL: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    cashRcredit: {
        type: Number,
        enum: [CashRCredit.Cash, CashRCredit.Credit],
        required: true
    },
    fromCode: {
        type: String,
        maxlength: 10,
        required: true,
        trim: true,
        validate: {
			validator: function(v) {

                var vUserId;

                if(this instanceof mongoose.Query)
                {
                    vUserId = this.getQuery().userId;
                }
                else
                {
                    vUserId = this.userId;
                }

				return validateRefFld(vUserId, mongoose.model(global.collections.account), 'code', v);
			},
            message: props => { console.log(props); return `${props.value} is not a valid account`}
		}
    },
    toCode: {
        type: String,
        maxlength: 10,
        required: true,
        trim: true,
        validate: {
			validator: function(v) {
                var vUserId;

                if(this instanceof mongoose.Query)
                {
                    vUserId = this.getQuery().userId;
                }
                else
                {
                    vUserId = this.userId;
                }

				return validateRefFld(vUserId, mongoose.model(global.collections.account), 'code', v);
			},
            message: props => { console.log(props); return `${props.value} is not a valid account`}
		}
    },
    invcNo: {
        type: String,
        maxlength: 50,
        required: true
    },
    invcDate:{
        type: Date,
        required: true
    },
    fiveAmt: {
        type: Number,
        default: 0.00
    },
    fivePerAmt: {
        type: Number,
        default: 0.00
    },
    twelveAmt: {
        type: Number,
        default: 0.00
    },
    twelvePerAmt: {
        type: Number,
        default: 0.00
    },
    eighteenAmt: {
        type: Number,
        default: 0.00
    },
    eighteenPerAmt: {
        type: Number,
        default: 0.00
    },
    twntyEightAmt: {
        type: Number,
        default: 0.00
    },
    twntyEightPerAmt: {
        type: Number,
        default: 0.00
    },
    zeroAmt: {
        type: Number,
        default: 0.00
    },
    totalAmt: {
        type: Number,
        default: 0.00
    },
    totalPerAmt: {
        type: Number,
        default: 0.00
    },
    roundingAmt: {
        type: Number,
        default: 0.00
    },
    totalInvcAmt: {
        type: Number,
        default: 0.00
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: global.collections.user,
        validate: {
			validator: function(v) {
				return validateRefId(mongoose.model(global.collections.user), v);
			},
            message: props => { return `${props.value} is not a valid user id!`}
		}
    }
},{
    writeConcern: "majority"
});

inventoryCollectionSchema.index( {userId: 1, invntryType: 1 , SL: 1}, {unique: true});

function validate(record, finYearStart, finYearEnd){

    const schema = Joi.object({
        invntryType: Joi.number().required().valid(InventoryType.Sale, InventoryType.Purchase, InventoryType.SaleReturn, InventoryType.PurchaseReturn, InventoryType.Other),
        SL: Joi.number().required(),
        date: Joi.date().min(finYearStart).max(finYearEnd).required(),
        cashRcredit: Joi.number().required().valid(CashRCredit.Cash, CashRCredit.Credit),
        fromCode: Joi.string().max(10).required(),
        toCode: Joi.string().max(10).required(),
        invcNo: Joi.string().max(50),
        invcDate: Joi.date().required(),
        fiveAmt: Joi.number(),
        fivePerAmt: Joi.number(),
        twelveAmt: Joi.number(),
        twelvePerAmt: Joi.number(),
        eighteenAmt: Joi.number(),
        eighteenPerAmt: Joi.number(),
        twntyEightAmt: Joi.number(),
        twntyEightPerAmt: Joi.number(),
        zeroAmt: Joi.number(),
        totalAmt: Joi.number(),
        totalPerAmt: Joi.number(),
        roundingAmt: Joi.number(),
        totalInvcAmt: Joi.number()
    });

    return schema.validate(record);
}

const InventoryCollectionModel = mongoose.model(global.collections.inventory, inventoryCollectionSchema);

module.exports.validate = validate;
module.exports.InventoryModel = InventoryCollectionModel;
module.exports.InventoryType = InventoryType;
module.exports.CashRCredit = CashRCredit;
