const express = require('express')
const auth = require('../middleware/auth')
const cartController = require('../controllers/cartController')
const router = new express.Router()

router.post('/cart', auth, cartController.addToCart)
router.get('/cart', auth, cartController.getCart)
router.patch('/cart/:id', auth, cartController.updateCart)
router.delete('/cart/:id', auth,  cartController.removeFromCart)

module.exports = router
