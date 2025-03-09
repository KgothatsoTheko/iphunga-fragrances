const nodemailer = require ('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "kgothatsotheko7@gmail.com",
        pass: "oexloshrxmdljoza"
    },
    tls: {
        rejectUnauthorized: false
    }
});

 
const sendMail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent');
    } catch (error) {
        console.error(error);
    }
};

module.exports = sendMail