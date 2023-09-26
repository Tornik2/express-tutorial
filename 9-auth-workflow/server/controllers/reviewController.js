const { StatusCodes } = require('http-status-codes')
const { checkPermissions } = require('../utils/checkPermissions')

const Review = require('../models/Review')
const Product = require('../models/Product')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
    .populate({path: 'product', select: 'name company'})
    .populate({path: 'user', select: 'name'})
    
    res.json({ reviews, nbHits: reviews.length })
}

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review) {
        throw new NotFoundError('no review found with given ID')
    }

    res.status(StatusCodes.OK).json({ review })
}

const createReview = async (req, res) => {
    const { product: productId } = req.body
    const product = await Product.findOne({_id: productId})
    if(!product) {
        throw new NotFoundError('no product found with given ID')
    }

    const alreadySubmitted = await Review.findOne({user: req.user.userId, product: productId})
    if(alreadySubmitted) {
        throw new BadRequestError('Already submitted the review for this product')
    }

    // create a review
    const review = await Review.create({...req.body, user: req.user.userId})
    res.status(StatusCodes.CREATED).json({ review })
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOneAndDelete({_id: reviewId})
    if(!review) {
        throw new NotFoundError('no review found with given ID')
    }
    checkPermissions(req.user, review.user)

    res.status(StatusCodes.OK).json({ msg: 'Review Deleted'})
}

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOneAndUpdate({_id: reviewId}, req.body, {
        runValidators: true,
        new: true
    })
    if(!review) {
        throw new NotFoundError('no review found with given ID')
    }
    checkPermissions(req.user, review.user)
    
    res.status(StatusCodes.OK).json({ review })
}

const getSingleProductReviews = async (req, res) => {
    console.log(req.params)
    const {id: prodId} = req.params
    const reviews = await Review.find({product: prodId})

    res.status(StatusCodes.OK).json({ reviews, nbHits: reviews.length })
}

module.exports = {
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    createReview,
    getSingleProductReviews
}