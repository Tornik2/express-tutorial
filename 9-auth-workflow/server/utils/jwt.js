const jwt = require("jsonwebtoken")

const createJwt = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET)
    return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = async ({res,payload, refreshToken}) => {
    const oneDay = 1000 * 60 * 60 * 24

    const accessTokenJWT = await createJwt(payload)
    const refreshTokenJWT = await createJwt({payload,refToken:refreshToken})
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: 1000
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