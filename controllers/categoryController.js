const Product = require('../models/product')
const Category = require('../models/category')

const categoryController = {
    //display categories
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
        
            res.status(200).send(categories)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    //display all products in a specific Category
    getProductCategories: async (req, res) => {
        const sort = {}
        let perPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
    
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        
        try {
            const numOfProducts = await Product.countDocuments()
            const pages = Math.ceil(numOfProducts / perPage);
            
            const category = await Category.findOne({name: req.params.category})
            if (!category) {
                res.status(404).send({message: `Product Not Found from category ${req.params.category}!`})
            }
        
            const products = await Product.find({category: category.name})
                .limit(perPage)
                .sort(sort)
                .skip((perPage * page) - perPage)
            
            res.status(200).send({ products, currentPage: page, pages: pages, perPage: perPage, numOfProducts })
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = categoryController;
