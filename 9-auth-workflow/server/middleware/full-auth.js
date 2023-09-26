const CustomError = require('../errors');
const Token = require('../models/Token');
const { isTokenValid, attachCookiesToResponse } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
  const {accessToken, refreshToken} = req.signedCookies

  try {
    if(accessToken) {
      const payload = isTokenValid(accessToken)
      req.user = payload
      return next()
    } 
    const {payload, refToken} = isTokenValid(refreshToken)
    // check if refreshtoken user is valid
    const existingToken = await Token.findOne({
      user: payload.userId,
      refreshToken: refToken
    })
    if(!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }

    await attachCookiesToResponse({res, payload, refreshToken: existingToken.refreshToken})
    req.user = payload
    next()

  } catch (error) {
    console.log(error)
    throw new CustomError.UnauthenticatedError('Invalid Authentication');
  }
 
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
