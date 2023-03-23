require('dotenv').config();
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');

const newPatientMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.USER,
            pass: process.env.EMAILPASS,
            secure: false
        }
    })

    let mailOptions = {
        from: process.env.USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(mailOptions)
}

module.exports = newPatientMail
