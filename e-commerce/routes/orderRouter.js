const express = require('express')
const router = express.Router()

const { authenticateUser, authorizeRoles } = require('../middleware/full-auth')
const {
    createOrder,
    updateOrder,
    getCurrentUserOrders,
    getAllOrders,
    getSingleOrder
} = require('../controllers/orderController')

router.route('/')
.get([authenticateUser,authorizeRoles('admin')], getAllOrders)
.post(authenticateUser, createOrder)

router.route('/showUserOrders').get(authenticateUser, getCurrentUserOrders)

router.route('/:id')
.get(authenticateUser, getSingleOrder)
.patch(authenticateUser, updateOrder)


module.exports = router