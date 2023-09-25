const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { attachCookiesToResponse, createTokenUser } = require('../utils/jwt')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
    
    // first register person is an ADMIN
    const isFirstUser = (await User.countDocuments({})) === 0 
    const role = isFirstUser ? "admin" : "user"

    const newUser = await User.create({...req.body, role})
    const payload = createTokenUser(newUser)
    
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
        //log out
        res.cookie('token', 'logout', {
        httpOnly: true,
        expire: new Date(Date.now())
    })
        throw new UnauthenticatedError('Password is incorrect')
    }
    //pass token through cookies
    const payload = createTokenUser(user)

    await attachCookiesToResponse({res, payload})
    res.status(StatusCodes.OK).json({ user: payload})
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expire: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: 'logged out'})
}


module.exports = {register, login, logout}