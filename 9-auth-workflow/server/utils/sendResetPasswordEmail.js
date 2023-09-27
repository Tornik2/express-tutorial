const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async (email, passwordToken ,origin)=> {
    const resetLink = `
        ${origin}/user/reset-password?email=${email}&token=${passwordToken}`
    
    const message = `
    <p>To reset your password please follow this link: </p><a href="${resetLink}">Reset Password</a>
    `
    return sendEmail(email, 'Reset Password', message)
}

module.exports = sendResetPasswordEmail