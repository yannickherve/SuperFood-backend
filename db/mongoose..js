const mongoose = require('mongoose')
require("dotenv").config()

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
