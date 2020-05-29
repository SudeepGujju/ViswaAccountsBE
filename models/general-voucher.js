const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId, validateRefFld } = require('../utils/model-validators');

const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    code: {
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
                    vUserId = this.parent().userId;
                }

				return validateRefFld(vUserId, mongoose.model(global.collections.account), 'code', v);
			},
            message: props => { console.log(props); return `${props.value} is not a valid account`}
		}
    },
    desc: {
        type: String,
        maxlength: 50,
        required: true
    },
    dbAmt: {
        type: Number,
        default: 0.00
    },
    crAmt: {
        type: Number,
        default: 0.00
    }
});

const generalVoucherCollectionSchema = new Schema({
    No: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    vouchList:[voucherSchema],
    totDbAmt: {
        type: Number,
        default: 0.00
    },
    totCrAmt: {
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
            message: props => { console.log(props); return `${props.value} is not a valid user id!`}
		}
    }
});

generalVoucherCollectionSchema.index( {userId: 1, No: 1}, {unique: true});

const voucher = Joi.object({
    _id: Joi.objectId().allow(''),
    code: Joi.string().max(10).required(),
    desc: Joi.string().max(10).required(),
    dbAmt: Joi.number().required(),
    crAmt: Joi.number().required()
});

function validate(record, finYearStart, finYearEnd){

    const schema = Joi.object({
        No: Joi.number().required(),
        date: Joi.date().min(finYearStart).max(finYearEnd).required(),
        totDbAmt: Joi.number().required(),
        totCrAmt: Joi.number().required(),
        vouchList: Joi.array().required().items(voucher)
    });

    return schema.validate(record);
}

const GeneralVoucherCollectionModel = mongoose.model(global.collections.generalVoucher, generalVoucherCollectionSchema);

module.exports.validate = validate;
module.exports.GeneralVoucherModel = GeneralVoucherCollectionModel;