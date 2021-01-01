const Address = require('../models/address')

const addressController = {
    createAddress: async (req, res) => {
        const address = await new Address({
            ...req.body,
            user: req.user
        })
        
        try {
            await address.save()
            res.status(201).send(address)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getAddresses: async (req, res) => {
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        
        try {
            const numOfAddress= await Address.countDocuments()
            const pages = Math.ceil(numOfAddress / perPage);
            
            const addresses = await Address.find({user: req.user._id}).populate('user', 'name')
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
            
            res.status(200).send({ addresses, currentPage: page, pages: pages, perPage: perPage, numOfAddress })
        } catch (e) {
            res.status(500).send(e)
        }
    },
    updateAddress: async (req, res) => {
        const _id = req.params.id
        const updatesData = {
            ...req.body
        };
        const valid = Object.keys(updatesData)
        const allowedUpdates = ['full_name','phone', 'city', 'postcode', 'address1', 'address2', 'professional', 'civility', 'company', 'country']
        const isValidOperation = valid.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        try {
            const address = await Address.findOneAndUpdate({ _id }, { $set: updatesData})
            
            if (!address) {
                res.status(404).send({ message: 'Address Not Found!'})
            }
            res.status(200).send({ message: 'Updated Address Successfully!'})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    getAddress: async (req, res) => {
        const _id = req.params.id
        try {
            const address = await Address.findOne({_id, user: req.user._id}).populate('user', 'name email phone')
            
            if (!address) {
                res.status(404).send({ message: 'Address Not Found!' })
            }
            res.status(200).send(address)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    deleteAddress: async (req, res) => {
        const _id = req.params.id
        try {
            const address = await Address.findOneAndDelete({ _id}).populate('user', 'name email phone')
            
            if (!address) {
                res.status(404).send({ message: 'Address Not Found!' })
            }
            res.status(200).send(address)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = addressController;
