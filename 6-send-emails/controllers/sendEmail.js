const nodemailer = require('nodemailer')

// create reusable transporter using SMTP (ethereal email)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'marjolaine82@ethereal.email',
        pass: 'QdQ215JrW17FWEcJt3'
    }
});

const sendEmail = async (req, res) => {

    const info = await transporter.sendMail({
    from: '"Tornike" <tornik2@yahoo.com>', // sender address
    to: "ttornik2@gmail.com, ttornik2@gmail.com", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world howariu?", // plain text body
    html: "<b>Hello world?</b>", // html body
    })
    res.json(info)
}

module.exports = sendEmail