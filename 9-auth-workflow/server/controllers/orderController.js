const { StatusCodes } = require('http-status-codes')
const  CustomError  = require('../errors')
const Order = require('../models/Order')
const Product = require('../models/Product') 
const { checkPermissions } = require('../utils/checkPermissions')

const getAllOrders = async(req, res) => {
    const orders = await Order.find({})

    res.status(StatusCodes.OK).json({ hbHits: orders.length, orders })
}

const getSingleOrder = async(req, res) => {
    const { id: orderId } = req.params
    const order = await Order.findOne({_id: orderId})
    if(!order) {
        throw new CustomError.NotFoundError('order not found with given Id')
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async(req, res) => {
    const {userId} = req.user
    const order = await Order.findOne({user: userId})
    if(!order) {
        throw new CustomError.NotFoundError('order not found by the user')
    }
    res.status(StatusCodes.OK).json({ order })
}

const updateOrder = async(req, res) => {
    const { id: orderId } = req.params
    const order = await Order.findOneAndUpdate({_id: orderId}, req.body, {
        runValidators: true,
        new: true
    })
    if(!order) {
        throw new CustomError.NotFoundError('order not found with given Id')
    }
    checkPermissions(req.user, order.user)
    
    res.status(StatusCodes.OK).json({ order })
}

const createOrder = async(req, res) => {
    const {tax, shippingFee, items: cartItems} = req.body
    if(!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No Cart Items Provided')
    }
    if(!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please Provide Tax and Shipping Fee')
    }

    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct) {
            throw new CustomError.NotFoundError('Product not found')
        }
        const {image, price, name, _id} = dbProduct
        const singleOrderItems = {
            amount: item.amount,
            price,
            name,
            image,
            product: _id
        }
        orderItems = [...orderItems, singleOrderItems]
        subtotal += price * item.amount
    }
    const total = subtotal + shippingFee + tax
    
    const order = await Order.create({
        tax, 
        shippingFee, 
        total, 
        subtotal, 
        orderItems, 
        user: req.user.userId,
        clientSecret: 'some'
    })
    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret})
}

module.exports = {
    createOrder,
    updateOrder,
    getCurrentUserOrders,
    getAllOrders,
    getSingleOrder
}