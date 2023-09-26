const sendEmail = require('./sendEmail')

const sendVerificationEmail = ( name, verificationtoken, email, origin ) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationtoken}&email=${email}`;

    const message = `
    <h1>hello ${name}</h1>
    <p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`

    return sendEmail(email,'verification', message)
}

module.exports = sendVerificationEmail