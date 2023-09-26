const express = require('express')
const router = express.Router()

const { logout, login, register, verifyEmail } = require('../controllers/authController')



router.route('/logout').get(logout)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/verifyEmail').post(verifyEmail)

module.exports = router