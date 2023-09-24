const {UnauthorizedError} = require('../errors/index')

const checkPermissions = (requestUser, recourceUserId) => {
    if(requestUser.role === 'admin') return
    if(requestUser.userId === recourceUserId.toString())  return 
    console.log(requestUser, recourceUserId)
    throw new UnauthorizedError('not authorized to access this route')
}

module.exports = {checkPermissions}