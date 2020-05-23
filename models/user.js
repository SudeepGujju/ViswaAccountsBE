const Joi = require('@hapi/joi');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserStatus = Object.freeze({ Active: 1, Inactive: 2 });

const Schema = mongoose.Schema;

const userCollectionSchema = new Schema({
    username:{
        type: String,
        minlength: 1,
        maxlength: 30,
        required: true,
        uppercase: true
    },
    loginID: {
        type: String,
        minlength: 3,
        maxlength: 15,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true
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
    finYear:{
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [UserStatus.Active, UserStatus.Inactive],
        required: true
    },
    permissions: {
        createAccount: {
            type: Boolean,
            default: false
        },
        editAccount: {
            type: Boolean,
            default: false
        },
        deleteAccount: {
            type: Boolean,
            default: false
        },
        viewListAccount: {
            type: Boolean,
            default: false
        },
        createVoucher: {
            type: Boolean,
            default: false
        },
        editVoucher: {
            type: Boolean,
            default: false
        },
        deleteVoucher: {
            type: Boolean,
            default: false
        },
        viewListVoucher: {
            type: Boolean,
            default: false
        },
        createInventory: {
            type: Boolean,
            default: false
        },
        editInventory: {
            type: Boolean,
            default: false
        },
        deleteInventory: {
            type: Boolean,
            default: false
        },
        viewListInventory: {
            type: Boolean,
            default: false
        },
        createGroup: {
            type: Boolean,
            default: false
        },
        editGroup: {
            type: Boolean,
            default: false
        },
        deleteGroup: {
            type: Boolean,
            default: false
        },
        viewListGroup: {
            type: Boolean,
            default: false
        },
        createGenVoucher: {
            type: Boolean,
            default: false
        },
        editGenVoucher: {
            type: Boolean,
            default: false
        },
        deleteGenVoucher: {
            type: Boolean,
            default: false
        },
        viewListGenVoucher: {
            type: Boolean,
            default: false
        },
        createUser: {
            type: Boolean,
            default: false
        },
        editUser: {
            type: Boolean,
            default: false
        },
        deleteUser: {
            type: Boolean,
            default: false
        },
        viewListUser: {
            type: Boolean,
            default: false
        },
        editUserPersmissions: {
            type: Boolean,
            default: false
        },
        generateReports: {
            type: Boolean,
            default: false
        },
        uploadFile: {
            type: Boolean,
            default: false
        }
    }
}, {
    // toJSON: { virtuals: true }
});

// userCollectionSchema.pre('findOneAndRemove', async function(){

//     const group = await this.findOne().select('code').lean();

//     const count = await AccountModel.countDocuments({groupCode: group.code});

//     if(count && count > 0)
//         throw new mongoose.Error('Group is linked with other records to delete.');
// })

userCollectionSchema.methods.generateAuthToken = function () {

    return jwt.sign(
        { _id: this._id, username: this.username },
        global.tokenSecret,
        { expiresIn: '1h' }
    );
};

const schema = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    loginID: Joi.string().min(3).max(15).required(),
    phone: Joi.string().allow('').min(10).max(10),
    password: Joi.string().min(8).max(15).required(),
    finYear: Joi.string().required(),
    status: Joi.number().required().valid(UserStatus.Active, UserStatus.Inactive)
});

const permSchema = Joi.object({

    permissions: Joi.object({
        createAccount: Joi.boolean(),
        editAccount: Joi.boolean(),
        deleteAccount: Joi.boolean(),
        viewListAccount: Joi.boolean(),
        createVoucher: Joi.boolean(),
        editVoucher: Joi.boolean(),
        deleteVoucher: Joi.boolean(),
        viewListVoucher: Joi.boolean(),
        createInventory: Joi.boolean(),
        editInventory: Joi.boolean(),
        deleteInventory: Joi.boolean(),
        viewListInventory: Joi.boolean(),
        createGroup: Joi.boolean(),
        editGroup: Joi.boolean(),
        deleteGroup: Joi.boolean(),
        viewListGroup: Joi.boolean(),
        createGenVoucher: Joi.boolean(),
        editGenVoucher: Joi.boolean(),
        deleteGenVoucher: Joi.boolean(),
        viewListGenVoucher: Joi.boolean(),
        createUser: Joi.boolean(),
        editUser: Joi.boolean(),
        deleteUser: Joi.boolean(),
        viewListUser: Joi.boolean(),
        editUserPersmissions: Joi.boolean(),
        generateReports: Joi.boolean(),
        uploadFile: Joi.boolean()
    })
});

const loginSchema = Joi.object({
    loginID: Joi.string().required(),
    password: Joi.string().required()
});

function validate(data) {
    return schema.validate(data, { stripUnknown: true });
}

function validatePermissions(data) {
    return permSchema.validate(data);
}

function validateLogin(data) {
    return loginSchema.validate(data, { stripUnknown: true });
}

const UserCollectionModel = mongoose.model(global.collections.user, userCollectionSchema);

module.exports.validate = validate;
module.exports.UserModel = UserCollectionModel;
module.exports.validateLogin = validateLogin;
module.exports.UserStatus = UserStatus;
module.exports.validatePermissions = validatePermissions;