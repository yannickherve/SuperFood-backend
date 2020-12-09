const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}, {timestamps: true})

categorySchema.virtual('products', {
    ref: 'Product',
    localField: 'name',
    foreignField: 'category'
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
