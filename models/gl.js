const mongoose = require("mongoose");
const { validateRefId, validateRefFld } = require('../utils/model-validators');
const { GroupType } = require('./group');

const Schema = mongoose.Schema;

const glCollectionSchema = new Schema({
    no: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    code: {
        type: String,
        maxlength: 10,
        required: true,
        trim: true,
        // validate: {
		// 	validator: function(v) {

        //         var vUserId;

        //         if(this instanceof mongoose.Query)
        //         {
        //             vUserId = this.getQuery().userId;
        //         }
        //         else
        //         {
        //             vUserId = this.userId;
        //         }

		// 		return validateRefFld(vUserId, mongoose.model(global.collections.account), 'code', v);
		// 	},
        //     message: props => { console.log(props); return `${props.value} is not a valid account`}
		// }
    },
    desc: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        default: 0.00
    },
    debit: {
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
    // groupCode: {
    //     type: String,
    //     // ref: global.collections.group,
    //     // required: true,
    //     default: ''
    //     // validate: {
	// 	// 	validator: function(v) {
                
    //     //         var vUserId;

    //     //         if(this instanceof mongoose.Query)
    //     //         {
    //     //             vUserId = this.getQuery().userId;
    //     //         }
    //     //         else
    //     //         {
    //     //             vUserId = this.userId;
    //     //         }

	// 	// 		return validateRefFld(vUserId, mongoose.model(global.collections.group), 'code', v);
	// 	// 	},
    //     //     message: props => { console.log(props); return `${props.value} is not a valid group`}
	// 	// }
    // },
    // groupType: {
    //     type: Number,
    //     enum: [GroupType.Trading, GroupType.ProfitAndLoss, GroupType.BalanceSheet],
    //     // required: true
    // }
},{
    writeConcern: "majority"
});

glCollectionSchema.index( {userId: 1} );

const GLCollectionModel = mongoose.model(global.collections.gl, glCollectionSchema);

const trailBalanceCollectionSchema = new Schema({
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
    town: {
        type: String,
        maxlength: 50
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
    groupCode: {
        type: String,
        ref: global.collections.group,
        required: true,
        // validate: {
		// 	validator: function(v) {
                
        //         var vUserId;

        //         if(this instanceof mongoose.Query)
        //         {
        //             vUserId = this.getQuery().userId;
        //         }
        //         else
        //         {
        //             vUserId = this.userId;
        //         }

		// 		return validateRefFld(vUserId, mongoose.model(global.collections.group), 'code', v);
		// 	},
        //     message: props => { console.log(props); return `${props.value} is not a valid group`}
		// }
    },
    groupType: {
        type: Number,
        enum: [GroupType.Trading, GroupType.ProfitAndLoss, GroupType.BalanceSheet],
        required: true
    },
    totalCredit: {
        type: Number,
        required: true,
        default: 0.00
    },
    totalDebit: {
        type: Number,
        required: true,
        default: 0.00
    },
    balance:{
        type: Number,
        required: true,
        default: 0.00
    }
},{
    writeConcern: "majority"
});

trailBalanceCollectionSchema.index( {userId: 1} );

const TrailBalanceCollectionModel = mongoose.model(global.collections.trailBalance, trailBalanceCollectionSchema);

module.exports.GLCollectionModel = GLCollectionModel;
module.exports.TrailBalanceCollectionModel = TrailBalanceCollectionModel;