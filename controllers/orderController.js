const Order = require('../models/order')
const Cart = require('../models/cart')
const Address = require('../models/address')

const orderController = {
    createOrder: async (req, res) => {
        const retrieveAddress = await Address.find({ _id: req.body.address })
        const address = req.body.address
        const cart = await Cart.find({user: req.user._id}).populate('product')
        const order = await new Order({
            ...req.body,
            user: req.user,
            address: address,
            products: cart,
            addressInfos: retrieveAddress[0]
        })
        try {
            await order.save()
            res.status(201).send(order)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    //Purchase order history for current user
    getOrders: async (req, res) => {
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        try {
            const numOfOrders = await Order.countDocuments()
            const pages = Math.ceil(numOfOrders / perPage);
            
            const orders = await Order.find({user: req.user._id}).populate('user', 'name email phone')
                .populate('address', '_id')
                .populate('cart', 'name')
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
    
            if (!orders) {
                res.status(404).send({ message: 'Orders Not Found!' })
            }
            
            res.status(200).send({ orders, currentPage: page, pages: pages, perPage: perPage, numOfOrders })
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getOrder: async (req, res) => {
        const _id = req.params.id
        try {
            const order = await Order.findOne({_id, user: req.user._id}).populate('user', 'name email phone')
                .populate('address', 'address1 phone civility full_name city postcode company')
                .populate('products')
    
            if (!order) {
                res.status(404).send({message: 'Order Not Found!'})
            }
            res.status(200).send(order)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    updateOrderStatus: async (req, res) => {
        const _id = req.params.id
        const updatesData = {
            ...req.body
        };
        const valid = Object.keys(updatesData)
        const allowedUpdates = ['status']
        const isValidOperation = valid.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        try {
            const order = await Order.findOneAndUpdate({ _id }, { $set: updatesData})
            
            if (!order) {
                res.status(404).send({message: 'Order Not Found!'})
            }
            res.status(200).send({message: 'Order updated Successfully!'})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getStatusValues: async (req, res) => {
        try {
            const order = await Order.schema.path('status').enumValues
            res.status(200).send(order)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getPaymentValues: async (req, res) => {
        try {
            const order = await Order.schema.path('payment').enumValues
            res.status(200).send(order)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = orderController;
