const express = require('express')
const router = express.Router()

const { getAllUsers, showCurrentUser, updateUser, updateUserPassword, getSingleUser } = require('../controllers/userController')
const { authenticateUser, authorizeRoles } = require('../middleware/full-auth')

router.route('/').get(authenticateUser, authorizeRoles('admin', 'ruler', 'boss'), getAllUsers)

router.route('/showMe').get(showCurrentUser)
router.route('/updateUser').post(updateUser)
router.route('/updateUserPassword').patch(updateUserPassword)

router.route('/:id').get(authenticateUser, getSingleUser)



module.exports = router