//crypto - for creating random string 
const crypto = require('crypto')

const User = require('../models/User')
const Token = require('../models/Token')

const {StatusCodes} = require('http-status-codes')
const { attachCookiesToResponse, createTokenUser } = require('../utils/jwt')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail')


const register = async (req, res) => {
    
    // first register person is an ADMIN
    const isFirstUser = (await User.countDocuments({})) === 0 
    const role = isFirstUser ? "admin" : "user"

    const verificationToken = crypto.randomBytes(40).toString('hex')

    // req.body = {name, email, password }
    const {name, email } = req.body
    const newUser = await User.create({...req.body, role, verificationToken })
    // host
    const origin = 'http://localhost:3000'
    await sendVerificationEmail(name, verificationToken, email, origin)

    res.status(StatusCodes.CREATED).json({ msg: 'Please check your email and verify', verificationToken: newUser.verificationToken})

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
    if(!user.isVerified) {
        throw new UnauthenticatedError('Please verify your email')
    }

    //pass token through cookies
    const payload = createTokenUser(user)
    //refreshToken
    let refreshToken = ''
    //check existingToken
    const existingToken = await Token.findOne({user: user._id})
    if(existingToken) {
        if(!existingToken.isValid) {
            throw new UnauthenticatedError('Invalid Credentials')
        }
        refreshToken = existingToken.refreshToken
        
        await attachCookiesToResponse({res, payload, refreshToken})
        res.status(StatusCodes.OK).json({ user: payload})
        return
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const ip = req.ip
    const userAgent = req.headers['user-agent']
    const userToken = {refreshToken, ip, userAgent, user: user._id}

    await Token.create(userToken)

    await attachCookiesToResponse({res, payload, refreshToken})
    res.status(StatusCodes.OK).json({ user: payload})
}

const logout = async (req, res) => {
    await Token.findOneAndDelete({user: req.user.userId})
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expire: new Date(Date.now())
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expire: new Date(Date.now())
    })
    
    res.status(StatusCodes.OK).json({msg: 'logged out'})

}

const verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body
    const user = await User.findOne({email})
    if(!user)  {
        throw new UnauthenticatedError('Verification Failed/ No user found')
    }
    const isTokenCorrect = verificationToken === user.verificationToken
    if(!isTokenCorrect) {
        throw new UnauthenticatedError('Verification Failed/Incorrect Token')
    }

    // verify user
    user.isVerified = true
    user.verified = Date.now()
    user.verificationToken = ''
    await user.save()

    res.status(StatusCodes.OK).json({ msg: 'Email verified' })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    if(!email) {
        throw new BadRequestError('Please provide valid email')
    }
    const user = await User.findOne({email})
    if(!user)  {
        throw new BadRequestError('Bad Request')
    }
    console.log(user._id.toString(), req.user.userId)
    if(user._id.toString() !== req.user.userId) {
        throw new BadRequestError('Bad Request')
    }
    //set passwordToken and expiration date on user
    const passwordToken = crypto.randomBytes(40).toString('hex')
    const tenMinutes = 1000 * 60 * 10
    user.passwordToken = passwordToken
    user.passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)
    await user.save()
    //send reset password link
    const origin = 'http://localhost:3000'
    await sendResetPasswordEmail(email, user.passwordToken, origin)

    res.status(StatusCodes.OK).json({ msg: 'Reset Password Email is Sent', passwordToken: user.passwordToken })
}

const resetPassword = async (req, res) => {
    const { email, token, password } = req.body
    const user = await User.findOne({email})

    if (!user) {
        throw new NotFoundError('User Not Found')
    }
    
    const currentDate = new Date()
    if(user.passwordToken === token && user.passwordTokenExpirationDate > currentDate) {
        user.password = password
        user.passwordToken = null
        user.passwordTokenExpirationDate = null
        await user.save()
    } else {
        throw new BadRequestError('Password Reset Link has expired')
    }
    
    res.status(StatusCodes.OK).json({ msg: 'Password Renewed', user })
}
module.exports = { forgotPassword, resetPassword ,register, login, logout, verifyEmail }