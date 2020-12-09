const mongoose = require('mongoose')
//const validator = require('validator')

const discountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        discount: {
            type: mongoose.Schema.Types.Double
        },
        type: {
            type: Number
        },
        valid: {
            type: Date
        },
        quantity: Number
    },
    { timestamps: true }
)

const Discount = mongoose.model('Discount', discountSchema)

module.exports = Discount
