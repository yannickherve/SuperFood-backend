const express = require('express')
const auth = require('../middleware/auth')
const userPrivilege = require('../middleware/userPrivilege')
const productController = require('../controllers/productController')
const { uploadProductImage } = require('../middleware/uploadImage')
const router = express.Router();

//middleware auth is first before all operations
//after that check id user is moderator (restaurant owner) or admin

/* CREATE product. -> role isModerator, restaurant owner.  */
router.post('/products', auth, userPrivilege.isModerator, uploadProductImage.single('image'), productController.createProduct)
/* GET all products. */
router.get('/products', productController.getProducts)
/* GET all products by restaurant. */
router.get('/products/restaurant/:id', productController.getProductsByRestaurant)
/* GET single product. */
router.get('/products/:id', productController.getProduct)
/* Edit single product. -> role isModerator, restaurant owner. */
router.patch('/products/:id', auth, userPrivilege.isModerator, uploadProductImage.single('image'), productController.updateProduct)
/* DELETE product -> role isModerator, restaurant owner0 */
router.delete('/products/:id', auth, userPrivilege.isModerator, productController.deleteProduct)

module.exports = router
