const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const { validateRefId } = require('../utils/model-validators');
const {  AccountModel } = require('./account');

const GroupType = Object.freeze({Trading: 1, ProfitAndLoss: 2, BalanceSheet: 3 });

const Schema = mongoose.Schema;

const groupCollectionSchema = new Schema({
    code: {
        type: String,
        maxlength: 10,
        required: true,
        trim: true
    },
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    grpType: {
        type: Number,
        enum: [GroupType.Trading, GroupType.ProfitAndLoss, GroupType.BalanceSheet],
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
            message: props => { console.log(props); return `${props.value} is not a valid user id!`}
		}
    }
}, {
    writeConcern: "majority"
    // toJSON: { virtuals: true },
});

groupCollectionSchema.index( {userId: 1, code: 1}, {unique: true});

groupCollectionSchema.pre('findOneAndRemove', async function(){

    const group = await this.findOne().select('code').lean();

    const count = await AccountModel.countDocuments({groupCode: group.code});

    if(count && count > 0)
        throw new mongoose.Error('Group is linked with other records to delete.');
});

const schema = Joi.object({
    code: Joi.string().max(10).required(),
    name: Joi.string().max(50).required(),
    grpType: Joi.number().required().valid(GroupType.Trading, GroupType.ProfitAndLoss, GroupType.BalanceSheet)
});

function validate(group){
    return schema.validate(group);
}

const GroupCollectionModel = mongoose.model(global.collections.group, groupCollectionSchema);

module.exports.validate = validate;
module.exports.GroupModel = GroupCollectionModel;
module.exports.GroupType = GroupType;
