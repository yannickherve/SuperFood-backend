const express = require('express')
const categoryController = require('../controllers/categoryController')
const router = new express.Router()

router.get('/products/category/:category', categoryController.getProductCategories)
router.get('/categories', categoryController.getCategories)

module.exports = router
