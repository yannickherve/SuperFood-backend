const Restaurant = require('../models/restaurant')
const sharp = require("sharp");
const baseImgUrl = 'http://localhost:4000/images/restaurants/'

const restaurantController = {
    createRestaurant: async (req, res) => {
        if (!req.file) {
            res.status(401).send({error: 'Please provide an image'});
        }
    
        const filename = req.file.originalname.replace(/\..+$/, "");
        const newFilename = `${filename}-${Date.now()}.png`;
        
        const restaurant = await new Restaurant({
            ...req.body,
            user: req.user,
            image: baseImgUrl + newFilename
        })
        
        try {
            await sharp(req.file.buffer)
                .resize(750, 450)
                .toFormat('png')
                .jpeg({ quality: 100 })
                .toFile(`public/images/restaurants/${newFilename}`);
            
            req.body.image = newFilename
            await restaurant.save()
            res.status(201).send(restaurant)
        } catch (e) {
            res.status(400).send(e)
        }
    },
    fetchRestaurants: async (req, res) => {
        const match = {}
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let queryName = ''
    
        if (req.query.name) {
            queryName = req.query.name
        }
    
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
    
        try {
            const numOfRestaurants = await Restaurant.countDocuments({name: {$regex: queryName, $options: 'i'}})
            const pages = Math.ceil(numOfRestaurants / perPage);
            
            const restaurants = await Restaurant.find({name: {$regex: queryName, $options: 'i'}})
                .populate('user', 'name')
                .populate('address')
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
        
            res.status(200).send({restaurants, currentPage: page, pages: pages, perPage: perPage, numOfRestaurants})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getRestaurant: async (req, res) => {
        const _id = req.params.id
    
        try {
            const restaurant = await Restaurant.findOne({_id }).populate('user', 'name email')
        
            if (!restaurant) {
                res.status(404).send({message: 'Restaurant Not Found!'})
            }
        
            res.status(201).send(restaurant)
        } catch (e) {
            res.status(500).send({error: e, message: 'fetch restaurant fail'})
        }
    },
    deleteRestaurant: async (req, res) => {
        const _id = req.params.id
        
        try {
            const restaurant = await Restaurant.findOneAndDelete({ _id})
            
            if (!restaurant) {
                res.status(404).send({message: 'restaurant Not Found!'})
            }
            
            res.status(200).send(restaurant)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    updateRestaurant: async (req, res) => {
        const _id = req.params.id
        const updatesData = {
            ...req.body
        };
        const valid = Object.keys(updatesData)
        const allowedUpdates = ['name', 'description', 'image', 'status']
        const isValidOperation = valid.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        
        try {
            if (req.file) {
                const filename = req.file.originalname.replace(/\..+$/, "");
                const newFilename = `${filename}-${Date.now()}.png`;
                
                updatesData.image = baseImgUrl + newFilename;
                await sharp(req.file.buffer)
                    .resize(750, 450)
                    .toFormat('png')
                    .jpeg({ quality: 100 })
                    .toFile(`public/images/restaurants/${newFilename}`);
    
                req.body.image = newFilename
            }
            const restaurant = await Restaurant.findOneAndUpdate({ _id }, { $set: updatesData})
            
            if (!restaurant) {
                res.status(404).send({message: 'Restaurant Not Found!'})
            }
            
            res.status(200).send({message: 'Updated Restaurant Successfully!'})
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = restaurantController;
