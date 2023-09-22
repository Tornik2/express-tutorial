const { BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes') 
const User = require('../models/User')

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({msg: users})
}

const getSingleUser = async (req, res) => {
    const {id} = req.params
    const user = await User.findOne({_id: id}).select('-password')
    if(!user) {
        throw new BadRequestError('no user found with given ID')
    }

    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
    res.status(200).json({msg: 'show current user'})
}

const updateUser = async (req, res) => {
    res.status(200).json({msg: 'update single user'})
}

const updateUserPassword = async (req, res) => {
    res.status(200).json({msg: 'good single user password'})
}
module.exports = {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword}