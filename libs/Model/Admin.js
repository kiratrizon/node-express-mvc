const Model = require("../Main/Model");

class Admin extends Model {
    constructor() {
        super('admins');
        this.setAlias(this.constructor.name);
    }
    fillable = [
        'username',
        'email',
        'password',
    ];
}

module.exports = new Admin();