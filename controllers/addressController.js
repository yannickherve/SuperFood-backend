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
    getAddress: async (req, res) => {
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
}

module.exports = addressController;
