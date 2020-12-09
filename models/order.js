const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    address: {// user adress one or multiple
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    products: [{//cart item
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount' // discount promo
    },
    amount: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Amount must be a positive number')
            }
        }
    }, //total price for products
    payment: {
        type: String,
        default: 'card',
        enum: ['card', 'mandate', 'transfer', 'check'] //enum payment mode
    },
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
        //['Non traité', 'Traitement', 'Expédié(s)', 'Livré', 'Annulé']
    },
    invoice_id : {
        type: Number //transaction id
    },
    invoice_number : {
        type: String,
        maxlength: 40
    },
    deliveryName: String // Nom livreur
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
