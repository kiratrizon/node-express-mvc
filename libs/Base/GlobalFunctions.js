const fs = require('fs');
const path = require('path');
const mailer = require('nodemailer');
const NodeMailer = require('../../vendor/node-mailer');

class GlobalFunctions {
    constructor() {
        this.mailer = NodeMailer;
    }

    only(obj, keys) {
        let newObj = {};
        keys.forEach(key => {
            if (obj[key] !== undefined) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    }
    ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    log(value, destination, text = "") {
        const dirPath = path.join(__dirname, '..', '..', 'tmp');
        const logPath = path.join(dirPath, `${destination}.log`);
        const timestamp = this.formatTimestamp();

        const logMessage = `${timestamp} ${text}\n${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}\n\n`;

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (!fs.existsSync(logPath)) {
            fs.writeFileSync(logPath, '', 'utf8');
        }

        fs.appendFileSync(logPath, logMessage, 'utf8');
    }
}

module.exports = GlobalFunctions;