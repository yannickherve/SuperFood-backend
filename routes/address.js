const express = require('express')
const auth = require('../middleware/auth')
const addressController = require('../controllers/addressController')
const router = new express.Router()

router.post('/addresses', auth, addressController.createAddress)
router.get('/addresses', auth, addressController.getAddresses)
router.get('/addresses/:id', auth, addressController.getAddress)
router.patch('/addresses/:id', auth, addressController.updateAddress)

module.exports = router
