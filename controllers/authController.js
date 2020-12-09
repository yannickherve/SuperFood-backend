const User = require('../models/user')
//const multer = require('multer')
//const sharp = require('sharp')

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
        const allowedUpdates = ['name', 'email', 'password', 'age', 'phone', 'newsletter']
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
    //uploadAvatar: async (req, res) => {
    //    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    //    req.user.avatar = buffer
    //    await req.user.save()
    //    res.send()
    //},
}

module.exports = authController
