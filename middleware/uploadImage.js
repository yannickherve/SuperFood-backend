const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-'+ file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
        cb(new Error('Please upload an image'))
    }
}
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: fileFilter
});

const uploadProductImage = multer({
    limits: {
        fileSize: 6000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        
        cb(undefined, true)
    }
})

const uploadRestaurantImage = multer({
    limits: {
        fileSize: 6000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        
        cb(undefined, true)
    }
})

module.exports = {
    upload,
    uploadProductImage,
    uploadRestaurantImage
}
