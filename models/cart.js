const mongoose = require('mongoose')
//const validator = require('validator')

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number, // quantity for product commanded
            default: 1,
            validate(value) {
                if (value < 0) {
                    throw new Error('Quantity must be a positive number')
                }
            }
        },
        save_for_later: {
            type: Boolean,
            default: false
        },
        name: String, //name of product,
        categoryProduct: String,
        price: {
            type: Number,
            validate(value) {
                if (value < 0) {
                    throw new Error('Price must be a positive number')
                }
            }
        }
    },
    { timestamps: true }
)

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
