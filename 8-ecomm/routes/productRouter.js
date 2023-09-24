const express = require('express')
const router = express.Router()

const {
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    createProduct,
    updateProduct,
    uploadImage
} = require('../controllers/productController')
const { authenticateUser, authorizeRoles } = require('../middleware/full-auth')
const { getSingleProductReviews } = require('../controllers/reviewController')

router.route('/')
.get(getAllProducts)
.post([authenticateUser, authorizeRoles('admin')], createProduct)

router.route('/uploadImage').post(uploadImage)

router.route('/:id')
.get(getSingleProduct)
.delete([authenticateUser, authorizeRoles('admin')], deleteProduct)
.patch([authenticateUser, authorizeRoles('admin')], updateProduct)

router.route('/:id/reviews').get(getSingleProductReviews)


module.exports = router