import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Logger } from '../utils';

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
            Logger.logError("sendMail", error);
        } else {
            Logger.log("sendMail", `Alert sent: ${info.response}`);
        }
    });
}

export default {
    sendAlert
};