const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
  let token;
  
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  // check cookies
  
  else if (req.signedCookies.token) {
    token = req.signedCookies.token;
  }

  if (!token) {
    throw new CustomError.UnauthenticatedError(' invalid Authentication: no token');
  }
  try {
    const payload = isTokenValid(token);
    // Attach the user and his permissions to the req object
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };

    next();
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
