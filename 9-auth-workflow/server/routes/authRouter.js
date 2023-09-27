const express = require('express')
const router = express.Router()

const { logout, login, register, verifyEmail, forgotPassword, resetPassword} = require('../controllers/authController')
const { authenticateUser } = require('../middleware/full-auth')



router.route('/logout').get( authenticateUser , logout)
router.route('/login').post(login)
router.route('/register').post(register)
router.route('/verifyEmail').post(verifyEmail)
router.route('/reset-password').post(resetPassword)
router.route('/forgot-password').post(authenticateUser, forgotPassword)



module.exports = router