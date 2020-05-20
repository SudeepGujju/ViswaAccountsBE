const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId } = require('../utils/model-validators');

const Schema = mongoose.Schema;

const productCollectionSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    },
    packing: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    },
    qty: {
        type: Number,
        default: 0
    },
    mrp:{
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
            message: props => { return `${props.value} is not a valid user id!`}
        }
    }
},{
    toJSON: {virtuals: true}
});

productCollectionSchema.virtual('user', {
    ref: global.collections.user, // The model to use
    localField: 'userId', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
});

const schema = Joi.object({
    name: Joi.string().min(1).required(),
    packing: Joi.string(),
    company: Joi.string().min(1),
    qty: Joi.number(),
    mrp: Joi.number()
});

function validate(product){
    return schema.validate(product);
}

const ProductCollectionModel = mongoose.model(global.collections.product, productCollectionSchema);

module.exports.validate = validate;
module.exports.ProductModel = ProductCollectionModel;