const nodemailer = require('nodemailer');
const sendEmail = async options => {
    const client = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }
    });
    const mailOptions = {
        from: "Kianai",
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await client.sendMail(mailOptions);
}
module.exports = sendEmail 