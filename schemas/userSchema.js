const mongoose = require('mongoose')
const validator = require('validator')
const phonesLocales = require('../helpers/phones')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        maxlength: 3,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: false,
        validate(value) {
            if(!validator.isMobilePhone(value.toString(), phonesLocales)) {
                throw new Error('Number phone is invalid')
            }
        }
    },
    role: {
        type: Number,
        default: 0, // 0:user, 1:moderator 2: admin
        enum: [0, 1, 2],
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Role not valid')
            }
        }
    },
    last_seen: {
        type: Date,
        default: Date.now() //last connection
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = userSchema
