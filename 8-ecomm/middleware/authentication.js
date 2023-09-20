const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require('../errors')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer')) {
        throw new BadRequestError('Not Authorized')
    }

    const token = header.split(' ')[1]
    if(!token) {
        throw new BadRequestError('Not Authorized')

    }
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
        req.user = {id: payload.userId, name: payload.name}
    } catch (error) {
        console.log(error)
    }
}