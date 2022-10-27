const User = require('../models/user')
const sharp = require('sharp')
require("dotenv").config()

const authController = {
    signup: async (req, res) => {
        const user = new User(req.body)
        // Check if user already exist in database
        const verifyIfUserExist = await User.findOne({name: req.body.name})
        const verifyIfEmailExist = await User.findOne({email: req.body.email})
    
        try {
            if (verifyIfUserExist) {
                return res.status(400).send({ message: 'Failed! name is already in use!' });
            }
            if (verifyIfEmailExist) {
                return res.status(400).send({ message: 'Failed! Email is already taken!' });
            }
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            console.log(token);
            res.send({ user, token })
        } catch (e) {
            res.status(400).send({ message: 'login failed. Email or password is incorrect!'})
        }
    },
    me: async (req, res) => {
        try {
            res.send(req.user)
        } catch (e) {
            res.send(e)
        }
    },
    editMe: async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age', 'phone', 'newsletter', 'address']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        
        try {
            updates.forEach((update) => req.user[update] = req.body[update])
            await req.user.save()
            res.send(req.user)
        } catch (e) {
            res.status(400).send(e)
        }
    },
    deleteMe: async (req, res) => {
        try {
            await req.user.remove()
            res.send(req.user)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    logout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.user.save()
        
            res.send({ message: 'logout successfully.'})
        } catch (e) {
            res.status(500).send()
        }
    },
    logoutAll: async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    },
    CreateUserAvatar: async (req, res) => {
        try {
            req.user.avatar = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
            await req.user.save()
            res.send({message: 'Avatar Uploaded Successfully!'})
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    },
    getUserAvatar: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user || !user.avatar) {
                res.status(404).send({message: 'User Avatar Not exist!'})
            }
            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        } catch (e) {
            res.status(404).send()
        }
    },
    deleteUserAvatar: async (req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send({ message: 'Avatar Deleted Successfully!'})
    }
}

module.exports = authController
