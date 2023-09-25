const jwt = require("jsonwebtoken")

const createJwt = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = async ({res,payload}) => {
    const oneDay = 1000 * 60 * 60 * 24

    const token = await createJwt(payload)
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })

}

const createTokenUser = (user)=> {
    const userToken = {
        userId: user._id,
        name: user.name,
        role: user.role

    }
    return userToken
}

module.exports = {createJwt, isTokenValid, attachCookiesToResponse, createTokenUser}