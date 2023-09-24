const { StatusCodes } = require('http-status-codes')
const  CustomError  = require('../errors')
const path = require('path')
const Product = require('../models/Product')

const getAllProducts = async (req, res) => {
    const products = await Product.find({}).populate('reviews')

    res.status(StatusCodes.OK).json({ products, nbHits: products.length })
}

const getSingleProduct = async (req, res) => {
    const { id } = req.params
    const product = await Product.findOne({_id: id}).populate('reviews')
    if(!product) {
        throw new CustomError.BadRequestError('Sorry, No Product with that id')
    }

    res.status(StatusCodes.OK).json({ product })
}

const createProduct = async (req, res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)

    res.status(StatusCodes.CREATED).json({ product })
}

const updateProduct = async (req, res) => {
    const { id: productId} = req.params
    const product = await Product.findOneAndUpdate(
        { 
            _id: productId 
        }, 
        req.body, 
        {
            runValidators: true,
            new: true
        })

    if(!product) {
        throw new CustomError.BadRequestError('Sorry, No Product with that id')
    }
    res.status(StatusCodes.OK).json({ product })

}

const deleteProduct = async (req, res) => {
    const { id: productId} = req.params
    const product = await Product.findOneAndDelete({ _id: productId })

    if(!product) {
        throw new CustomError.BadRequestError('Sorry, No Product with that id')
    }

    res.status(StatusCodes.OK).json({ product })
}

const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('Image is not uploaded')
    }
    const image = req.files.image

    if(!image.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('please upload image')
    }
    const maxSize = 1024 * 1024
    if(image.size > maxSize) {
        throw new BadRequestError('Image size should not be bigger than 1KB')
    }

    const imagePath = path.join(__dirname,'../public/uploads/' + image.name)
    await image.mv(imagePath)
    res.status(StatusCodes.OK).json({image: `/uploads/${image.name}`})
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    createProduct,
    updateProduct,
    uploadImage
}