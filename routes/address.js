const express = require('express')
const auth = require('../middleware/auth')
const addressController = require('../controllers/addressController')
const router = new express.Router()

router.post('/addresses', auth, addressController.createAddress)
router.get('/addresses', auth, addressController.getAddress)

module.exports = router
