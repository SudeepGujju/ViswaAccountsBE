const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId, validateRefFld } = require('../utils/model-validators');
const { BankModel } = require('./bank');
const { InventoryModel } = require('./inventory');

const Schema = mongoose.Schema;

const accountCollectionSchema = new Schema({
    code: {
        type: String,
        maxlength: 10,
        required: true,
        trim: true,
        uppercase: true
    },
    firmName: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    proprietor: {
        type: String,
        maxlength: 50,
    },
    phone: {
        type: String,
        // minlength: 10,
        maxlength: 10,
        validate: {
            validator: function(val){
                return val.length >= 10 || val.length === 0
            },
            message: () => 'phone cannot be less than 10 numbers'
        }
    },
    dno: {
        type: String,
        maxlength: 30
    },
    strtNo: {
        type: String,
        maxlength: 30
    },
    area: {
        type: String,
        maxlength: 50
    },
    town: {
        type: String,
        maxlength: 50
    },
    dl1: {
        type: String,
        maxlength: 50
    },
    dl2: {
        type: String,
        maxlength: 50
    },
    gst: {
        type: String,
        // minlength: 2,
        maxlength: 15,
        validate: {
            validator: function(val){
                return val.length >= 2 || val.length === 0
            },
            message: () => 'gst cannot be less than 2 characters'
        }
    },
    mailid:{
        type: String,
        maxlength: 50
    },
    opngBalAmt:{
        type: Number,
        default: 0.00
    },
    groupCode: {
        type: String,
        // ref: global.collections.group,
        required: true,
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

				return validateRefFld(vUserId, mongoose.model(global.collections.group), 'code', v);
			},
            message: props => { console.log(props); return `${props.value} is not a valid group`}
		}
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        // ref: global.collections.user,
        validate: {
			validator: function(v) {
				return validateRefId(mongoose.model(global.collections.user), v);
			},
            message: props => { console.log(props); return `${props.value} is not a valid user id!`}
		}
    }
}, {
    writeConcern: "majority"
    // toJSON: { virtuals: true }
});

accountCollectionSchema.index( {userId: 1, code: 1}, {unique: true});

accountCollectionSchema.pre('findOneAndRemove', async function(){

    const account = await this.findOne().select('code userId').lean();

    let count = await BankModel.countDocuments({ userId: account.userId, $or: [ {fromCode: account.code}, {toCode: account.code} ]});//{userId: account.userId}

    if(count && count > 0)
        throw new mongoose.Error('Account is linked with other records to delete.');

    count = await InventoryModel.countDocuments({ userId: account.userId, $or: [ {fromCode: account.code}, {toCode: account.code} ]});

    if(count && count > 0)
        throw new mongoose.Error('Account is linked with other records to delete.');
});

const schema = Joi.object({
    code: Joi.string().max(10).required(),
    firmName: Joi.string().max(50).required(),
    proprietor: Joi.string().allow('').max(50),
    phone: Joi.string().allow('').min(10).max(10),
    dno: Joi.string().allow('').max(30),
    strtNo: Joi.string().allow('').max(30),
    area: Joi.string().allow('').max(50),
    town: Joi.string().allow('').max(50),
    dl1: Joi.string().allow('').max(50),
    dl2: Joi.string().allow('').max(50),
    gst: Joi.string().allow('').min(2).max(50),
    mailid: Joi.string().email().allow('').max(50),
    opngBalAmt: Joi.number(),
    groupCode: Joi.string().required()
});

function validate(account){
    return schema.validate(account);
}

const AccountCollectionModel = mongoose.model(global.collections.account, accountCollectionSchema);

module.exports.validate = validate;
module.exports.AccountModel = AccountCollectionModel;