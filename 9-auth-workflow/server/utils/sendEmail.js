const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);

    const info = await transporter.sendMail({
    from: '"Tornike" <tornik2@yahoo.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html // html body
    })
}

module.exports = sendEmail