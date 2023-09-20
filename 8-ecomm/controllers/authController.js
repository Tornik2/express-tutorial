const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { createJwt } = require('../utils')
const { attachCookiesToResponse } = require('../utils/jwt')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
    
    // first register person is an ADMIN
    const isFirstUser = (await User.countDocuments({})) === 0 
    const role = isFirstUser ? "admin" : "user"

    const newUser = await User.create({...req.body, role})
    const payload = {
        userId: newUser._id,
        name: newUser.name
    }
    // send back token via cookies
    await attachCookiesToResponse({res, payload})    
    res.status(StatusCodes.CREATED).json({ user: payload})

}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new BadRequestError('Please provide both email and password')
    }
    const user = await User.findOne({email})
    if(!user)  {
        throw new UnauthenticatedError('No user found')
    }
    const isPasswordCorrect = await user.comparePasswords(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Password is incorrect')
    }
    //pass token through cookies
    const payload = {
        userId: user._id,
        name: user.name
    }
    await attachCookiesToResponse({res, payload})
    res.status(StatusCodes.OK).json({ user: payload})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(StatusCodes.OK).json({msg: 'logged out'})
}

module.exports = {register, login, logout}