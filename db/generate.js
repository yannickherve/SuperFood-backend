const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const faker = require("faker");

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'super-food-api'
//const ObjectId = mongodb.ObjectID
//const Product = require('../models/product')

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)
    //const category_id = new ObjectId()
    //const catName = ['Food', 'Pizza', 'Salad', 'Burger', 'Dessert']
    
    //generate category
    //for (let i = 0; i <= 4; i++) {
    //    db.collection('categories').insertMany( [
    //        { name : catName[i] }
    //    ], (error, result) => {
    //        if (error) {
    //            return console.log('Unable to insert documents!')
    //        }
    //        console.log(result)
    //        console.log(result.ops)
    //    })
    //}
    
    //
    
    //generate product and category relationships
    db.collection('categories').find({}).toArray(async (err, result) => {
        if (err) throw err
        let categoryArray = []

        await result.forEach(c => {
            categoryArray.push(c.name)
        })

        for (let i = 0; i <= 20; i++) {
            await db.collection('products').insertMany([
                {
                    name: faker.commerce.productName(),
                    description: faker.lorem.sentences(3),
                    price: faker.commerce.price(),
                    image: faker.image.food(),
                    quantity: faker.random.number(),
                    category: faker.random.arrayElement(categoryArray),
                    createdAt: '2020-11-26T14:02:35.517+00:00',
                    updatedAt: '2020-11-26T14:02:35.517+00:00'
                }
            ])
        }
    })
    
    //generate users
    //for (var i = 0; i <= 6; i++) {
    //    db.collection('users').insertMany( [
    //        {
    //            name: faker.name.findName(),
    //            email: faker.internet.email(),
    //            password: faker.internet.password(),
    //            phone: faker.phone.phoneNumber(),
    //            avatar: faker.image.avatar()
    //        }
    //    ], (error, result) => {
    //        if (error) {
    //            return console.log('Unable to insert documents!')
    //        }
    //        console.log(result.ops)
    //    })
    //}
    
    //generate adress and user relationships
    //db.collection('users').find({}).toArray(async (err, result) => {
    //    if (err) throw err
    //    let userArray = []
    //
    //    await result.forEach(c => {
    //        userArray.push(c._id)
    //    })
    //    console.log(userArray)
    //
    //    for (let i = 0; i <= 14; i++) {
    //        await db.collection('addresses').insertMany([
    //            {
    //                user: faker.random.arrayElement(userArray),
    //                full_name: faker.address.streetName(),
    //                adress1: faker.address.streetAddress(),
    //                bp: faker.address.zipCode(),
    //                city: faker.address.city(),
    //                phone: faker.phone.phoneNumber(),
    //            }
    //        ])
    //    }
    //})
    
})
