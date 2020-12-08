const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId, validateRefFld } = require('../utils/model-validators');

const OrderStatus = Object.freeze({Placed: 1, Confirmed: 2, Delivered: 3, Cancelled: 4});

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    }
},{
    writeConcern: "majority"
});

const orderCollectionSchema = new Schema({
    products: [orderItemSchema],
    date:{
        type: Date,
        required: true
    },
    totalCost: {
        type: Number
    },
    status: {
        type: Number,
        enum: [OrderStatus.Placed, OrderStatus.Confirmed, OrderStatus.Delivered, OrderStatus.Cancelled],
        required: true
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
    },
    stockistId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: global.collections.user,
        validate: {
			validator: function(v) {
				return validateRefId(mongoose.model(global.collections.user), v);
			},
            message: props => { return `${props.value} is not a valid user id!`}
		}
    },
},{
    writeConcern: "majority"
});

const orderItem = Joi.object({
    productId: Joi.objectId().required(),
    name: Joi.string().required(),
    quantity: Joi.number().required().min(1),
    mrp: Joi.number().required()
});

function validate(record){

    const schema = Joi.object({
        products: Joi.array().required().items(orderItem),
        // date: Joi.date().required(),
        // totalCost: Joi.number().required(),
        //status: Joi.number().required().valid(OrderStatus.Placed, OrderStatus.Confirmed, OrderStatus.Delivered, OrderStatus.Confirmed),
        stockistName: Joi.string().required(),
        stockistId: Joi.objectId().required()
    });

    return schema.validate(record);
}

const OrderCollectionModel = mongoose.model(global.collections.order, orderCollectionSchema);

module.exports.validate = validate;
module.exports.OrderModel = OrderCollectionModel;
module.exports.OrderStatus = OrderStatus;