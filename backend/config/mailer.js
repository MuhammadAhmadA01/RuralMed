const nodemailer = require('nodemailer'); // using nodemailer

// Create a transporter using SMTP or other transport options
const transporter = nodemailer.createTransport({ // creating a transport with service and login of mail
    service: 'gmail',
    auth: {
        user: 'mahmad.8962@gmail.com',
        pass: 'General7858084',
    },
});

// Send mail function
const sendMail = async (to, subject, text) => { // sendMail function
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'mahmad.8962@gmail.com',
            to,
            subject,
            text,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendMail };