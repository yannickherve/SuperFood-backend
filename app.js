const express = require('express');
const path = require('path');
require('./db/mongoose.')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const categoryRouter = require('./routes/category')
const orderRouter = require('./routes/order')
const addressRouter = require('./routes/address')
const cartRouter = require('./routes/cart')
const restaurantRouter = require('./routes/restaurant')
const cors = require('cors');
const bodyParser = require ('body-parser')

/*initialize app*/
const app = express();

/*initialize parse application/json*/
app.use(express.json());

/* CORS */
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));

/*import routes*/
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

/* use routes*/
app.use(userRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use(orderRouter)
app.use(addressRouter)
app.use(cartRouter)
app.use(restaurantRouter)

// use morgan to log requests to the console
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Setup static directory to serve
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
