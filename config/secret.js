const crypto = require('crypto');
const constant = {
    secret: crypto.randomBytes(64).toString('hex'),
};

module.exports = constant;