const mongoose = require('mongoose')
const userSchema = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Cart = require('./cart')
const Order = require('./order')
const Address = require('./address')
const Restaurant = require('./restaurant')

userSchema.virtual('addresses', {
    ref: 'Address',
    localField: '_id',
    foreignField: 'user'
})
userSchema.virtual('carts', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'user'
})
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {expiresIn: '2h'})
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
    if (!user) {
        throw new Error('Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

//Delete user carts when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Cart.deleteMany({ user: user._id })
    next()
})
//Delete user orders when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Order.deleteMany({ user: user._id })
    next()
})
//Delete user addresses when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Address.deleteMany({ user: user._id })
    next()
})

//Delete user restaurant when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Restaurant.deleteMany({ user: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
