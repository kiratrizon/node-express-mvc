const bcrypt = require('bcryptjs');

class Hash {
    constructor() {
        this.bcrypt = bcrypt;
    }

    make(password) {
        return this.bcrypt.hashSync(password, 10);
    }

    check(password, hash) {
        return this.bcrypt.compareSync(password, hash);
    }
}

module.exports = new Hash();