const express = require('express')
const auth = require('../middleware/auth')
const orderController = require('../controllers/orderController')
const router = new express.Router()

router.post('/orders', auth, orderController.createOrder)

router.get('/orders', auth, orderController.getOrders)
router.get('/orders/status-value', auth, orderController.getStatusValues)
router.get('/orders/payment-value', auth, orderController.getPaymentValues)
router.get('/orders/:id', auth, orderController.getOrder)

router.patch('/orders/:id', auth, orderController.updateOrderStatus)


module.exports = router
