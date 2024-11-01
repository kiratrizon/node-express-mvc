require('dotenv').config();

const constant = {
    user: process.env.MAILER_USER || '',
    pass: process.env.MAILER_APP_KEY || '',
};

module.exports = constant;