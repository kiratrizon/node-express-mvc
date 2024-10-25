const nodemailer = require('nodemailer');
const {translate} = require('@vitalets/google-translate-api');

class NodeMailer {
    constructor(config = null) {
        // You can store configuration if needed
    }

    async sendMail(params) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'schedulerascbislig@gmail.com',
                pass: 'sboffswwrexhrlqr',
            },
        });

        // Translate the message text
        const translatedMessage = await this.translateText(params.message, params.targetLang);
        const translatedSubject = await this.translateText(params.subject, params.targetLang);

        let mailOptions = {
            from: params.from,
            to: params.email,
            subject: translatedSubject,
            html: translatedMessage, // Use the translated message here
        };

        if (translatedMessage){
            try {
                let info = await transporter.sendMail(mailOptions);
                console.log('Message sent: %s', info.messageId);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }
    }

    async translateText(text, targetLang) {
        try {
            const res = await translate(text, {to: targetLang});
            return res.text;
        } catch (error) {
            console.error('Error translating text:', error);
            return null; // Return the original text in case of error
        }
    }
}

module.exports = NodeMailer;
