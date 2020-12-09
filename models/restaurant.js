const mongoose = require('mongoose')
const validator = require('validator')

const restaurantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    address: {// restaurant adress created by owner restaurant
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'close'] // enum means string objects
    },
    rating: Number,
    wallet: Number
}, {
    timestamps: true
})

//restaurantSchema.virtual('orders', {
//    ref: 'Order',
//    localField: '_id',
//    foreignField: 'user'
//})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
