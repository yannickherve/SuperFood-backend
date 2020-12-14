const express = require('express')
const { uploadUserAvatar } = require('../middleware/uploadImage')
require('../models/user');
const auth = require('../middleware/auth')
const authController = require('../controllers/authController')
const router = new express.Router()

router.post('/users/signup', authController.signup)

router.post('/users/login', authController.login)

router.get('/users/logout', auth, authController.logout)

router.post('/users/logoutAll', auth, authController.logoutAll)

router.get('/users/me', auth, authController.me)

router.patch('/users/me', auth, authController.editMe)

router.delete('/users/me', auth, authController.deleteMe)

router.post('/users/me/avatar', auth, uploadUserAvatar.single('avatar'),authController.CreateUserAvatar)

router.delete('/users/me/avatar', auth, authController.deleteUserAvatar)

router.get('/users/:id/avatar', authController.getUserAvatar)

module.exports = router
