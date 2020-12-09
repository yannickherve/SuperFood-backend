const Product = require('../models/product')
const Category = require('../models/category')
const sharp = require('sharp')
const fs = require('fs')
const baseImgUrl = 'http://localhost:4000/images/products/'

const productController = {
    createProduct: async (req, res) => {
        if (!req.file) {
            res.status(401).json({error: 'Please provide an image'});
        }
    
        const filename = req.file.originalname.replace(/\..+$/, "");
        const newFilename = `${req.body.category}-${filename}-${Date.now()}.png`;
        
        const category = await Category.findOne({name: req.body.category})
        
        const product = await new Product({
            ...req.body,
            category: category.name,
            image: baseImgUrl + newFilename,
            imageName: newFilename
        })
        
        try {
            await sharp(req.file.buffer)
                .resize(400, 400)
                .toFormat('png')
                .jpeg({ quality: 100 })
                .toFile(`public/images/products/${newFilename}`);
    
            req.body.image = newFilename
            
            await product.save()
            res.status(201).send(product)
        } catch (e) {
            res.status(400).send(e)
        }
    },
    getProducts: async (req, res) => {
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        
        try {
            console.log(req.body.restaurant)
            const numOfProducts = await Product.countDocuments()
            const pages = Math.ceil(numOfProducts / perPage);
            
            //const products = await Product.find().populate({path: 'category', select: 'name' })
            const products = await Product.find()
                .populate('restaurant', 'name description address email status')
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
            
            res.status(200).send({products, currentPage: page, pages: pages, perPage: perPage, numOfProducts})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    // Display all products in a specific restaurant
    getProductsByRestaurant: async (req, res) => {
        const _id = req.params.id
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        try {
            const numOfProducts = await Product.countDocuments({ restaurant: _id })
            const pages = Math.ceil(numOfProducts / perPage);
            
            const products = await Product.find({ restaurant: _id })
                .populate('restaurant', 'name description address email')
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
    
            
            res.status(200).send({products, currentPage: page, pages: pages, perPage: perPage, numOfProducts })
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getProduct: async (req, res) => {
        const _id = req.params.id
        
        try {
            const product = await Product.findOne({_id }).populate({
                path: 'restaurant',
                select: 'name description address email status',
                populate: {
                    path: 'address',
                    select: 'address'
                }
            })
            if (!product) {
                res.status(404).send({message: 'Product Not Found!'})
            }
            
            res.status(201).send(product)
        } catch (e) {
            res.status(500).send({error: e, message: 'Fetch product fail'})
        }
    },
    updateProduct: async (req, res) => {
        const category = await Category.findOne({name: req.body.category})
        const _id = req.params.id
        
        const updatesData = {
            ...req.body
        };
        const valid = Object.keys(updatesData)
        const allowedUpdates = ['name', 'description', 'price', 'quantity', 'category', 'image']
        const isValidOperation = valid.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        if(category) {
            updatesData.category = category._id
        }
        
        try {
            if (req.file) {
                const filename = req.file.originalname.replace(/\..+$/, "");
                const newFilename = `${filename}-${Date.now()}.png`;
                
                updatesData.image = baseImgUrl + newFilename;
                await sharp(req.file.buffer)
                    .resize(400, 400)
                    .toFormat('png')
                    .jpeg({ quality: 100 })
                    .toFile(`public/images/products/${newFilename}`);
    
                //req.body.image = newFilename
            }
    
            const product = await Product.findOneAndUpdate({ _id }, { $set: updatesData})
            
            if (!product) {
                res.status(404).send({message: 'Product Not Found!'})
            }
            
            res.status(200).send({message: 'Updated Product Successfully!'})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    deleteProduct: async (req, res) => {
        const _id = req.params.id
        //path to delete product image
        const pathToFile = 'D:/DEV/devdev/node-course/my_projects/superFood_backend/public/images/products/'
        
        try {
            const product = await Product.findOneAndDelete({ _id})
            if (!product) {
                res.status(404).send({message: 'Product Not Found!'})
            }
            // Delete file image from directory
            fs.unlinkSync(pathToFile + product.imageName);

            res.status(200).send(product)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = productController;
