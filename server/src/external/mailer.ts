import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECEIVER,
    subject: '',
    text: ''
};

function sendAlert(subject: string, text: string) {
    mailOptions.subject = `[CPA] ${subject}`;
    mailOptions.text = text;

    mail.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Alert sent: ' + info.response);
        }
    });
}

export default {
    sendAlert
};