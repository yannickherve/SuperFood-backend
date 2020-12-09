const Cart = require('../models/cart')
const Product = require('../models/product')

const cartController = {
    addToCart: async (req, res) => {
        const product = await Product.findOne({_id: req.body.product})
        const cart = await new Cart({
            ...req.body,
            name: product.name,
            price: product.price,
            product: product,
            categoryProduct: product.category,
            user: req.user
        })
        
        try {
            await cart.save()
            res.status(201).send(cart)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getCart: async (req, res) => {
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        try {
            const numOfCarts= await Cart.countDocuments({user: req.user._id})
            const pages = Math.ceil(numOfCarts / perPage);
            
            const carts = await Cart.find({user: req.user._id}).populate('user', 'name last_seen')
                .populate('product')
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
            
            res.status(200).send({ carts, currentPage: page, pages: pages, perPage: perPage, numOfCarts })
        } catch (e) {
            res.status(500).send(e)
        }
    },
    updateCart: async (req, res) => {
        const _id = req.params.id
        const updatesData = {
            ...req.body
        };
        const valid = Object.keys(updatesData)
        const allowedUpdates = ['quantity']
        const isValidOperation = valid.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        try {
            const cart = await Cart.findOneAndUpdate({ _id }, { $set: updatesData})
    
            if (!cart) {
                res.status(404).send({message: 'Item Not Found!'})
            }
            res.status(200).send({message: 'Updated quantity Successfully!'})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    removeFromCart: async (req, res) => {
        const _id = req.params.id
        try {
            const cart = await Cart.findOneAndDelete({ _id}).populate('user', 'name')
                .populate('product')
            
            if (!cart) {
                res.status(404).send({message: 'Item Not Found!'})
            }
            res.status(200).send(cart)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = cartController;
