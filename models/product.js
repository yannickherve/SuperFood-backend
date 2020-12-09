const mongoose = require('mongoose')
const productSchema = require('../schemas/productSchema')

//productSchema.virtual('carts', {
//    ref: 'Cart',
//    localField: '_id',
//    foreignField: 'product'
//})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
