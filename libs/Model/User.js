const Model = require("../Main/Model");

class User extends Model {
    constructor() {
        super('users');
        this.setAlias(this.constructor.name);
    }
    fillable = [
        'username',
        'password',
        'email',
    ]
}

module.exports = new User();
