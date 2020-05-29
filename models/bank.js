const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId, validateRefFld } = require('../utils/model-validators');

const Schema = mongoose.Schema;

const bankCollectionSchema = new Schema({
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
    SL: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    chNo:{
        type: String,
        maxlength: 10,
    },
    desc:{
        type: String,
        maxlength: 50,
        required: true
    },
    receipt:{
        type: Number,
        default: 0.00
    },
    payment:{
        type: Number,
        default: 0.00
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
},{
    // toJSON: { virtuals: true }
});

bankCollectionSchema.index( {userId: 1, date: 1 , SL: 1}, {unique: true});

function validate(record, finYearStart, finYearEnd){

    const schema = Joi.object({
        fromCode: Joi.string().max(10).required(),
        toCode: Joi.string().max(10).required(),
        SL: Joi.number().required(),
        date: Joi.date().min(finYearStart).max(finYearEnd).required(),
        chNo: Joi.string().allow('').max(10),
        desc: Joi.string().max(50).required(),
        receipt: Joi.number(),
        payment: Joi.number()
    });

    return schema.validate(record);
}

const BankCollectionModel = mongoose.model(global.collections.bank, bankCollectionSchema);

module.exports.validate = validate;
module.exports.BankModel = BankCollectionModel;