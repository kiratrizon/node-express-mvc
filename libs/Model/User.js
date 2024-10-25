const Model = require("../Main/Model");

class User extends Model {
    constructor() {
        super('users');
        this.setAlias(this.constructor.name);
    }
}

module.exports = new User();
