const mongoose = require('mongoose')
const validator = require('validator')

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    professional: {
        type: Boolean,
        trim: true,
        default: false
    },
    civility: {
        type: String,
        trim: true,
        //default: 'M',
        enum: ['Mme', 'M']
    },
    company: {
        type: String,
        maxlength: 100
    },
    full_name: {
        type: String,
        trim: true,
        maxlength: 100
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    bp: {
        type: String,
        trim: true,
        maxlength: 100
    },
    postcode: {
        type: String,
        trim: true,
        required: true,
        maxlength: 10
    },
    city: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        maxlength: 25,
        validate(value) {
            if(!validator.isMobilePhone(value)) {
                throw new Error('Number phone is invalid')
            }
        }
    }
}, {
    timestamps: true
})

addressSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user'
})

const Address = mongoose.model('Address', addressSchema)

module.exports = Address
