const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    restaurant: { //each dish(plat) from restaurant
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'Restaurant'
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
        validate(value) {
            if (value < 0) {
                throw new Error('Price must be a positive number')
            }
        }
    },
    category: {
        type: String,
        required: true,
        ref: 'Category'
    },
    active: {
        type: Boolean,
        trim: true,
        default: false
    },
    color: { //color of product
        type: String,
        trim: true,
        maxlength: 50
    },
    quantity: {
        type: Number,
        //required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Quantity must be a positive number')
            }
        }
    },
    image: {
        type: String,
        required: true,
    },
    imageName: {
        type: String
    },
    video: {
        data: Buffer,
        //contentType: String
    }
}, {
    timestamps: true
})

module.exports = productSchema
