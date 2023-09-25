const { StatusCodes } = require('http-status-codes') 
const { BadRequestError } = require('../errors')
const { createTokenUser, attachCookiesToResponse } = require('../utils/jwt')
const User = require('../models/User')
const { checkPermissions } = require('../utils/checkPermissions')

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({ users, nbHits: users.length})
}

const getSingleUser = async (req, res) => {
    const {id} = req.params
    const user = await User.findOne({_id: id}).select('-password')
    if(!user) {
        throw new BadRequestError('no user found with given ID')
    }
    checkPermissions(req.user, id)
    
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = async (req, res) => {
    const {name, email} = req.body
    if(!name || !email) {
        throw new BadRequestError('please fill all fields')
    }
    console.log(req.user)
    const user = await User.findOneAndUpdate({_id: req.user.userId}, { name, email }, {
        runValidators: true,
        new: true
    })

    const payload = createTokenUser(user)
    await attachCookiesToResponse({res, payload})

    res.status(StatusCodes.OK).json({msg: user})
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findOne({_id: req.user.userId})
    // check if old password is correct
    const isPasswordCorrect = await user.comparePasswords(oldPassword)
    console.log(isPasswordCorrect)
    if(!isPasswordCorrect) {
        throw new BadRequestError('Password is incorrect')
    }
    // if it's correct update it with new password
    user.password = newPassword
    await user.save()


    res.status(200).json({user})
}
module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword}