const express = require('express')
const router = express.Router()

const {
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    createReview,
} = require('../controllers/reviewController')
const { authenticateUser, authorizeRoles } = require('../middleware/full-auth')

router.route('/').get(getAllReviews).post(authenticateUser, createReview)

router.route('/:id')
.get(getSingleReview)
.patch(authenticateUser, updateReview)
.delete(authenticateUser, deleteReview)



module.exports = router