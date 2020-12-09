const express = require('express')
const auth = require('../middleware/auth')
const userPrivilege = require('../middleware/userPrivilege')
const restaurantController = require('../controllers/restaurantController')
const { uploadRestaurantImage } = require('../middleware/uploadImage')
const router = express.Router();

//middleware auth is first before all operations
//after that check id user is moderator (restaurant owner) or admin

/* CREATE restaurant. -> role isModerator, restaurant owner */
router.post('/restaurants', auth, userPrivilege.isModerator, uploadRestaurantImage.single('image'), restaurantController.createRestaurant)
/* GET all restaurants. */
router.get('/restaurants', restaurantController.fetchRestaurants)
/* GET single restaurant. */
router.get('/restaurants/:id', restaurantController.getRestaurant)
/* Edit single restaurant. -> role isModerator, restaurant owner. */
router.patch('/restaurants/:id', auth, userPrivilege.isModerator, uploadRestaurantImage.single('image'), restaurantController.updateRestaurant)
/* DELETE restaurant -> role isModerator, restaurant owner */
router.delete('/restaurants/:id', auth, userPrivilege.isModerator, restaurantController.deleteRestaurant)

module.exports = router
